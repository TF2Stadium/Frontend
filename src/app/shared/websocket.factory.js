import { Socket } from 'wsevent.js';

angular
  .module('tf2stadium.services')
  .factory('Websocket', Websocket);

/** @ngInject */
function Websocket($rootScope, $timeout, $log, $q,
                   Config, Notifications) {
  var connected = false;
  var reconnecting = false;
  var socket = null;

  function asyncAngularify(callback) {
    return function asyncAngularifedFn() {
      var args = arguments;
      $timeout(() => callback.apply(null, args), 0);
    };
  }

  socket = new Socket(Config.endpoints.websocket, {
    extractor: extractor,
    maxRetries: 0,
  });

  socket.onopen = (e) => {
    // Note: connected=true must come before we emit the event,
    // otherwise listeners might try to send data in response to the
    // event and it will never get sent (because when
    // connected==false, data gets queued for the socket-opened
    // event).
    connected = true;

    asyncAngularify(function () {
      $rootScope.$emit('socket-opened');
    })();

    $log.log('WebSocket connection opened', e);

    if (reconnecting) {
      Notifications.toast({
        message: 'Connected to TF2Stadium!',
        actionMessage: 'Ok',
      });
    }
  };

  socket.onclose = () => {
    // this callback is called both when an opened connection is
    // closed and when a closed connection attempts a reconnect, but
    // fails.
    $log.log('WebSocket closed');
    connected = false;

    asyncAngularify(() => $rootScope.$emit('socket-closed'))();

    Notifications.toast({
      message: 'Disconnected from server',
      error: true,
      actionMessage: 'Reconnect',
      action: () => {
        $log.log('WebSocket reconnecting');
        reconnecting = true;
        socket.connect();
      },
      hideDelay: 0,
    });
  };

  function extractor(data) {
    return data.request;
  }

  // Hack to work around our shitty app state handling: we want to
  // start the socket as soon as possible, and the server also sends
  // state initialization data as soon as possible, but that means
  // it is possible (and has been observed) for us to receive that
  // initialization data sent back before the proper handlers have
  // been registered.
  //
  // To account for this, we do an extra layer of event handling to
  // queue up messages and send them to event handlers that get
  // registered too slowly as they are registered.
  //
  // The same thing is done in .emitJSON for messages being sent out
  // before the socket is connected.
  var queuedMessages = Object.create(null);
  var registeredHandlers = Object.create(null);
  socket.onmessage = (name, data) => {
    if (!registeredHandlers[name]) {
      $log.log('Received message with no registered handler: ' + name,
               data);
      if (!queuedMessages[name]) {
        queuedMessages[name] = [];
      }

      queuedMessages[name].push(data);
    }
  };

  var factory = {};
  factory.onJSON = (name, callback, dontApply) => {
    if (console && console.timeStamp) {
      console.timeStamp('WS' + name);
    }

    callback = callback || angular.noop;
    var wrappedCallback = asyncAngularify(callback);

    // Dispatch queued messages for the initialization
    // workaround. Technically it is possible for messages to arrive
    // out of order by doing this, but it should be negligible (a
    // message would have to arrive and be delivered to the socket
    // between when this function completes and the 0-delay timeout of
    // asyncAngularify). We can't skip the timeout here because event
    // handlers are not generally defined with the intention of being
    // called before their enclosing scope finishes executing.
    function dispatchQueuedMessages() {
      queuedMessages[name].forEach(function (data) {
        $log.log('Received: ' + name, data);
        callback(data);
      });
    }

    registeredHandlers[name] = true;
    if (queuedMessages[name]) {
      if (dontApply) {
        dispatchQueuedMessages();
      } else {
        asyncAngularify(dispatchQueuedMessages)();
      }
    }

    socket.On(name, function (data) {
      $log.log('Received: ' + name, data);
      wrappedCallback(data);
    });
  };
  factory.on = factory.onJSON.bind(factory);

  factory.off = () => {
    // During transition to kefir this may be theoretically needed,
    // but currently none of our uses of Kefir fromEvent streams are
    // expected to actually call this.
    console.log('NOT IMPLEMENTED');
  };

  factory.emitJSON = (name, data, callback) => {
    var deferred = $q.defer();
    callback = asyncAngularify(callback || angular.noop);

    if (angular.isUndefined(data)) {
      data = {};
    }

    if (connected) {
      emitJSONImpl();
    } else {
      var deregister = $rootScope.$on('socket-opened', () => {
        emitJSONImpl();
        deregister();
      });
    }

    return deferred.promise;

    function emitJSONImpl() {
      $log.log('Sending ' + name, data);
      data.request = name;

      socket.Emit(data, (jsonIn) => {
        var dataIn = angular.fromJson(jsonIn);

        if (console && console.timeStamp) {
          console.timeStamp('WS' + name);
        }

        $log.log('Response to ' + name, dataIn);
        if (!dataIn.success) {
          Notifications.toast({
            message: dataIn.message,
            error: true,
            hideDelay: 5000,
          });
        }

        if (dataIn.success) {
          deferred.resolve(dataIn.data);
        } else {
          deferred.reject(dataIn.data);
        }

        callback(dataIn);
      });
    }
  };

  return factory;
}
