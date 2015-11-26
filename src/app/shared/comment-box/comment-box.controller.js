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

      var tabId = vm.currentTab;
      if (tabId === 1 && vm.rooms[1].id === -1) {
        // If we're on the main screen, and we're joined in a lobby
        // but not spectating one, then the only two visible tabs will
        // be general chat and "your lobby" chat, so the 2nd displayed
        // tab is the normally 3rd tab
        tabId = 2;
      }

      var room = vm.rooms[tabId].id;
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
