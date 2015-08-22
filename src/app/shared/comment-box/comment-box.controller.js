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
      //Websocket.emit('chatpost');
    };
  }
  
})();
