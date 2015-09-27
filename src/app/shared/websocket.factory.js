/* globals io */
(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('Websocket', Websocket);

  /** @ngInject */
  function Websocket(socketFactory, Config)
  {
    var factory = socketFactory({
      prefix: '',
      ioSocket: io.connect(Config.endpoints.websocket)
    });

    factory.onJSON = function(name, callback) {
      callback = callback || angular.noop;

      factory.on(name, function (data) {
        var json = {};
        if (typeof(json) !== "undefined" && data !== "") {
          json = JSON.parse(data);
        }
        callback(json);
      });
      
    };

    factory.emitJSON = function(name, data, callback) {
      callback = callback || angular.noop;
      var json = JSON.stringify(data);
      
      factory.emit(name, json, function(json) {
        var data = JSON.parse(json);
        callback(data);
      });

    };

    return factory;
  }
})();
