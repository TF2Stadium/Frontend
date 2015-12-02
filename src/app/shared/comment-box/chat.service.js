(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('ChatService', ChatService);

  /** @ngInject */
  function ChatService(Websocket, $rootScope, LobbyService) {
    var factory = {};

    // Persistent map of room id -> messages list
    var chatRoomLogs = Object.create(null);
    function getChatRoom(id) {
      if (angular.isUndefined(chatRoomLogs[id])) {
        chatRoomLogs[id] = [];
      }
      return chatRoomLogs[id];
    }

    function ChatRoom(id) {
      this.changeRoom(angular.isDefined(id)? id : -1);
    }

    ChatRoom.prototype.changeRoom = function chageRoom(id) {
      if (id !== this.id) {
        this.id = id;
        this.messages = getChatRoom(id);
      }
    };

    ChatRoom.prototype.leave = function leave() {
      this.changeRoom(-1);
    };

    var globalChatRoom = new ChatRoom(0);

    var spectatedChatRoom = new ChatRoom(LobbyService.getLobbySpectatedId());
    var joinedChatRoom = new ChatRoom(LobbyService.getLobbyJoinedId());

    joinedChatRoom.joined = true;

    var rooms = [globalChatRoom, joinedChatRoom, spectatedChatRoom];

    factory.getRooms = function () {
      return rooms;
    };

    factory.send = function (message, room) {
      Websocket.emitJSON('chatSend', {
        message: message,
        room: room
      });
    };

    /*eslint-disable angular/on-watch */
    /* the angular/on-watch warning doesn't apply to services */
    $rootScope.$on('lobby-joined', function () {
      joinedChatRoom.changeRoom(LobbyService.getLobbyJoinedId());
    });

    $rootScope.$on('lobby-left', function () {
      joinedChatRoom.leave();
    });

    $rootScope.$on('lobby-spectated-changed', function () {
      spectatedChatRoom.changeRoom(LobbyService.getLobbySpectatedId());
    });

    Websocket.onJSON('chatReceive', function (message) {
      message.timestamp = new Date(message.timestamp * 1000);

      var log = getChatRoom(message.room);

      // Insert messages in sorted order (sorted by message id)
      if (log.length === 0 || log[log.length - 1].id < message.id) {
        log.push(message);
      } else {
        // performance likely isn't an issue, but since the log is
        // sorted by id, it would be better to use a binary search
        // here (also, use ES6 findIndex when available).
        var insertIdx = 0;
        while (log[insertIdx].id < message.id) {
          insertIdx++;
        }
        if (log[insertIdx].id === message.id) {
          // Same message id? Overwrite the logged message
          log[insertIdx] = message;
        } else {
          // else insert it into the array (yeah, splice is far from
          // efficient, but this should be very rare).
          log.splice(insertIdx, 0, message);
        }
      }

      $rootScope.$emit('chat-message', message);
    });

    return factory;
  }
})();
