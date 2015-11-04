(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('CommentBoxController', CommentBoxController);

  /** @ngInject */
  function CommentBoxController ($rootScope, Websocket, ChatService) {
    var vm = this;

    vm.rooms = ChatService.getRooms();
    vm.currentTab = 0;

    vm.sendMessage = function(event) {
      if (vm.messageBox === "" || event.keyCode !== 13) {
        return;
      }

      var room = vm.rooms[vm.currentTab].id;
      ChatService.send(vm.messageBox, room);

      vm.messageBox = '';
      event.preventDefault();
    };

    vm.goToProfile = function(steamId) {
      window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };
  }
})();
