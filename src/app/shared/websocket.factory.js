/* globals io */
(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('Websocket', Websocket);

  /** @ngInject */
  function Websocket(socketFactory, Config, Notifications) {

    var connected = false;
    var factory = socketFactory({
      prefix: '',
      ioSocket: io.connect(Config.endpoints.websocket, {transports:["polling"]})
    });

    factory.on('socketInitialized', function() {
      console.log('Websocket connection initialized');
      connected = true;
    });

    var emitJSON = function(name, json, callback) {
      console.log('Sent ' + name);
      factory.emit(name, json, function(json) {
        var data = JSON.parse(json);
        console.log('Response to ' + name);
        console.log(data);
        if (!data.success) {
          Notifications.toast({message: data.message, error: true});
        }
        callback(data);
      });
    };

    factory.onJSON = function(name, callback) {
      callback = callback || angular.noop;

      factory.on(name, function (data) {
        var json = {};
        if (typeof(json) !== "undefined" && data !== "") {
          json = JSON.parse(data);
          console.log('Received ' + name);
          console.log(json);
        }
        callback(json);
      });

    };

    factory.emitJSON = function(name, data, callback) {
      callback = callback || angular.noop;
      var json = JSON.stringify(data);

      if (connected) {
        emitJSON(name, json, callback);
      } else {
        factory.on('socketInitialized', function() {
          emitJSON(name, json, callback);
        });
      }

    };

    return factory;
  }

})();
