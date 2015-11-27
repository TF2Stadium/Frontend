(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('Websocket', Websocket);

  /** @ngInject */
  function Websocket($rootScope, $timeout, $log, Config, Notifications) {
    var connected = false;
    var socket = null;

    var asyncAngularify = function (callback) {
      return function () {
        var args = arguments;
        $timeout(function () {
          callback.apply(null, args);
        }, 0);
      };
    };

    socket = new Socket(Config.endpoints.websocket,
                        {extractor: extractor});

    socket.onopen = function (e) {
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
    };

    socket.onclose = function (e) {
      asyncAngularify(function () {
        $rootScope.$emit('socket-closed');
      })();
      $log.log('WebSocket closed:', e);
      connected = false;
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
    socket.onmessage = function (name, data) {
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
    factory.onJSON = function (name, callback) {
      callback = asyncAngularify(callback || angular.noop);

      // Dispatch queued messages for the initialization
      // workaround. Technically it is possible for messages to arrive
      // out of order by doing this, but it should be negligible (a
      // message would have to arrive and be delivered to the socket
      // between when this function completes and the 0-delay timeout of
      // asyncAngularify). We can't skip the timeout here because event
      // handlers are not generally defined with the intention of being
      // called before their enclosing scope finishes executing.
      registeredHandlers[name] = true;
      if (queuedMessages[name]) {
        asyncAngularify(function () {
          queuedMessages[name].forEach(function (data) {
            $log.log('Received: ' + name, data);
            callback(data);
          });
        })();
      }

      socket.On(name, function (data) {
        $log.log('Received: ' + name, data);
        callback(data);
      });
    };

    function emitJSON(name, data, callback) {
      $log.log('Sending ' + name, data);
      data.request = name;

      socket.Emit(data, function (jsonIn) {
        var dataIn = angular.fromJson(jsonIn);
        $log.log('Response to ' + name, dataIn);
        $log.log(dataIn);
        if (!dataIn.success) {
          Notifications.toast({message: dataIn.message, error: true});
        }
        callback(dataIn);
      });
    }

    factory.emitJSON = function (name, data, callback) {
      callback = asyncAngularify(callback || angular.noop);

      if (connected) {
        emitJSON(name, data, callback);
      } else {
        var deregister = $rootScope.$on('socket-opened', function () {
          emitJSON(name, data, callback);
          deregister();
        });
      }
    };

    factory.isInitialized = function () {
      return connected;
    };

    return factory;
  }

})();
