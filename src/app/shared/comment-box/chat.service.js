(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('ChatService', ChatService);

  /** @ngInject */
  function ChatService(Websocket, $rootScope)
  {
    Websocket.on("chatReceive", function (data) {
      var message = JSON.parse(data);

      if (message.room === -1) {
        message.room = 0;
      }

      if (typeof factory.messages[message.room] === "undefined") {
        factory.messages[message.room] = [];
      }

      factory.messages[message.room].push(message);
      factory.notify();
    });


    var factory = {};

    factory.messages = {};
    factory.websocket = Websocket;

    factory.getMessages = function() {
      return factory.messages;
    };

    factory.subscribe = function(scope, callback) {
      var handler = $rootScope.$on('chat-message-receive', callback);
      scope.$on('$destroy', handler);
    };

    factory.notify = function() {
      $rootScope.$emit('chat-message-receive');
    };

    factory.send = function(message, room) {

      var payload = {
        message: message,
        room: room
      };

      Websocket.emit('chatSend', JSON.stringify(payload), function(data) {
        var response = JSON.parse(data);
        console.log(response);
      });


    };


    return factory;
  }
})();
