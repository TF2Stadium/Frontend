(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('CommentBoxController', CommentBoxController);

  /** @ngInject */
  function CommentBoxController ($scope, ChatService, LobbyService) {
    var vm = this;

    vm.messages = [];
    vm.currentTab = 0;
    vm.joinedLobby = false;

    ChatService.subscribe($scope, function() {
      vm.messages = ChatService.getMessages();
    });

    LobbyService.subscribeActive($scope, function(event) {
      vm.joinedLobby = LobbyService.getActive().id;
    });

    vm.sendMessage = function() {

      if (vm.messageBox == "" || event.keyCode != 13) {
        return false;
      }

      var room = 0;

      if (vm.currentTab != 0) {
        room = vm.joinedLobby;
      }

      ChatService.send(vm.messageBox, room);

      vm.messageBox = null;
      event.preventDefault();

    };
  }
})();
