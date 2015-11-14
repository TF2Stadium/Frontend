(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('CommentBoxController', CommentBoxController);

  /** @ngInject */
  function CommentBoxController ($rootScope, Websocket, ChatService, Notifications) {
    var vm = this;

    vm.rooms = ChatService.getRooms();
    vm.currentTab = 0;

    vm.sendMessage = function(event) {
      if (vm.messageBox === "" || event.keyCode !== 13) {
        return;
      }

      if (vm.error) {
        Notifications.toast({message: 'That message is too long', error: true});
        return;
      }

      var room = vm.rooms[vm.currentTab].id;
      ChatService.send(vm.messageBox, room);

      vm.messageBox = '';
      event.preventDefault();
    };

    vm.checkMessage = function() {
      //Check if message is longer than the char limit
      vm.error = typeof vm.messageBox === 'undefined';
    };

    vm.goToProfile = function(steamId) {
      window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };
  }
})();
