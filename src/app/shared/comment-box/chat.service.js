(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('ChatService', ChatService);

  /** @ngInject */
  function ChatService(Websocket, $rootScope) {

    var factory = {};

    var rooms = {};
    factory.websocket = Websocket;

    factory.getRooms = function() {
      return rooms;
    };

    factory.send = function(message, room) {
      Websocket.emitJSON('chatSend', {
        message: message,
        room: room
      });
    };

    Websocket.onJSON('chatReceive', function (message) {
      if (typeof rooms[message.room] === 'undefined') {
        rooms[message.room] = [];
      }
      rooms[message.room].push(message);
    });

    return factory;
  }
})();
