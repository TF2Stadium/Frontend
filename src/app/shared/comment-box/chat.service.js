(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('ChatService', ChatService);

  // Persistent map of room id -> messages list
  var chatRoomLogs = {};

  function ChatRoom(id) {
    this.changeRoom(angular.isDefined(id)? id : -1);
  }

  ChatRoom.prototype.changeRoom = function chageRoom(id) {
    if (id !== this.id) {
      this.id = id;
      if (chatRoomLogs.hasOwnProperty(id)) {
        this.messages = chatRoomLogs[id];
      } else {
        this.messages = chatRoomLogs[id] = [];
      }
    }
  };

  ChatRoom.prototype.leave = function leave() {
    this.changeRoom(-1);
  };

  /** @ngInject */
  function ChatService(Websocket, $rootScope, LobbyService) {
    var factory = {};

    var globalChatRoom = new ChatRoom(0);
    var spectatedChatRoom = new ChatRoom();
    var joinedChatRoom = new ChatRoom();

    joinedChatRoom.joined = true;

    var rooms = [globalChatRoom, spectatedChatRoom, joinedChatRoom];

    factory.getRooms = function() {
      return rooms;
    };

    factory.send = function(message, room) {
      Websocket.emitJSON('chatSend', {
        message: message,
        room: room
      });
    };

    $rootScope.$on('lobby-joined', function (e, id) {
      joinedChatRoom.changeRoom(id);
    });

    $rootScope.$on('lobby-left', function (e, id) {
      joinedChatRoom.leave();
    });

    $rootScope.$on('lobby-spectated-changed', function() {
      var spectatedLobby = LobbyService.getLobbySpectated();

      spectatedChatRoom.changeRoom(spectatedLobby.id);
    });

    Websocket.onJSON('chatReceive', function (message) {
      if (chatRoomLogs.hasOwnProperty(message.room)) {
        chatRoomLogs[message.room].push(message);
      } else {
        chatRoomLogs[message.room] = [message];
      }
    });

    // TODO: I think this message isn't needed
    Websocket.onJSON('chatHistoryClear', function() {
      // spectatedChatRoom.clear();
    });

    return factory;
  }
})();
