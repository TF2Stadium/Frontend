(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('ChatService', ChatService);

  /** @ngInject */
  function ChatService(Websocket, $rootScope, LobbyService) {

    var factory = {};
    var rooms = {
      general: {
        id: 0,
        messages: []
      },
      lobbySpectated: {
        id: -1,
        messages: []
      }
    };

    factory.getRooms = function() {
      return rooms;
    };

    factory.send = function(message, room) {
      Websocket.emitJSON('chatSend', {
        message: message,
        room: room
      });
    };

    $rootScope.$on('lobby-spectated-changed', function() {
      rooms.lobbySpectated.id = LobbyService.getLobbySpectated().id;
    });

    Websocket.onJSON('chatReceive', function (message) {
      if (message.room === 0) {
        rooms.general.messages.push(message);
      } else {
        rooms.lobbySpectated.messages.push(message);
      }
    });

    Websocket.onJSON('chatHistoryClear', function() {
      rooms.lobbySpectated.messages = [];
    });

    return factory;
  }
})();
