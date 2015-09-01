/* globals io */
(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('LobbyService', LobbyService);

  /** @ngInject */
  function LobbyService(Websocket, $rootScope)
  {
    Websocket.on("chatReceive", function (data) {
      var message = JSON.parse(data);
      factory.message[message.room].append(message);
      factory.notify(message.room);
    });


    var factory = {};

    factory.messages = {};

    factory.getMessages = function(room) {
      return factory.messages[room];
    };

    factory.subscribe = function(scope, callback, room) {
      var handler = $rootScope.$on('lobby-list-updated-'+room, callback);
      scope.$on('$destroy', handler);
    };

    factory.notify = function(room) {
      $rootScope.$emit('lobby-list-updated-'+room);
    };


    return factory
  }
})();
