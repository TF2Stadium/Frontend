(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('ChatService', ChatService);

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

  /** @ngInject */
  function ChatService(Websocket, $rootScope, LobbyService) {
    var factory = {};

    var globalChatRoom = new ChatRoom(0);

    var spectatedChatRoom = new ChatRoom(LobbyService.getLobbySpectatedId());
    var joinedChatRoom = new ChatRoom(LobbyService.getLobbyJoinedId());

    joinedChatRoom.joined = true;

    var rooms = [globalChatRoom, spectatedChatRoom, joinedChatRoom];

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
      getChatRoom(message.room).push(message);
      $rootScope.$emit('chat-message', message);
    });


    Websocket.onJSON('chatHistoryClear', function (data) {
      // Note: ChatRooms may have pointers to the arrays in
      // chatRoomLogs, so we have to mutate the actual logs rather
      // than just assign a new empty array.
      getChatRoom(data.room).length = 0;
    });

    return factory;
  }
})();
