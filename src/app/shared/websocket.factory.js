(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('Websocket', Websocket);

  /** @ngInject */
  function Websocket(Config, Notifications, $rootScope) {
    var connected = false;
    var socket = null;

    function connect() {
      socket = new WebSocket(Config.endpoints.websocket);

      socket.onopen = function (e) {
        // Note: connected=true must come before we emit the event,
        // otherwise listeners might try to send data in response to the
        // event and it will never get sent (because when
        // connected==false, data gets queued for the socket-opened
        // event).
        connected = true;
        $rootScope.$emit('socket-opened');
        console.log('WebSocket connection opened', e);
      };

      socket.onclose = function (e) {
        $rootScope.$emit('socket-closed');
        console.log('WebSocket closed:', e);
        connected = false;
        connect();
      };

      socket.onerror = function (e) {
        console.log('WebSocket error:', e);
      };
    }

    connect();

    function extractor(data) {
      return data.request;
    }

    var messageHandler = new Socket(socket, extractor);

    function emitJSON(name, data, callback) {
      console.log('Sent ' + name);
      data.request = name;

      messageHandler.Emit(data, function(jsonIn) {
        var data = JSON.parse(jsonIn);
        console.log('Response to ' + name);
        console.log(data);
        if (!data.success) {
          Notifications.toast({message: data.message, error: true});
        }
        callback(data);
      });
    }

    var factory = {};
    factory.onJSON = function(name, callback) {
      callback = callback || angular.noop;

      messageHandler.On(name, function (data) {
        console.log('Received ' + name, data);
        callback(data);
      });
    };

    factory.emitJSON = function(name, data, callback) {
      callback = callback || angular.noop;

      if (connected) {
        emitJSON(name, data, callback);
      } else {
        $rootScope.$on('socket-opened', function() {
          emitJSON(name, data, callback);
        });
      }
    };

    return factory;
  }

})();
