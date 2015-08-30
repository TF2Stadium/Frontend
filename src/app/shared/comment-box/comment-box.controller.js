(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('CommentBoxController', CommentBoxController);

  /** @ngInject */
  function CommentBoxController (Websocket) {
    var vm = this;

    vm.mainChatMessages = [];

    Websocket.on('chatReceive', function(data) {
      var message = JSON.parse(data);
      vm.mainChatMessages.push(message);
    });

    vm.sendMessage = function() {

      var message = {
        message: vm.messageBox,
        room: 0
      };

      vm.messageBox = '';

      Websocket.emit('chatSend', JSON.stringify(message), function(data) {
        var response = JSON.parse(data);

      });

      return false;
    };
  }
})();
