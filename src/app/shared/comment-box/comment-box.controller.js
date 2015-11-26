(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('CommentBoxController', CommentBoxController);

  /** @ngInject */
  function CommentBoxController ($rootScope, $scope,
                                 ChatService, Notifications) {
    var vm = this;

    vm.rooms = ChatService.getRooms();
    vm.lastSeenIds = Object.create(null);

    $scope.currentTab = 0;

    // The three tabs are:
    //  0 - global chat
    //  1 - spectated lobby chat
    //  2 - joined lobby chat
    // however, not all these tabs exist at all times, so
    // just directly reading currentTab isn't sufficient
    function currentTabId() {
      var tabId = $scope.currentTab;
      if (tabId === 1 && vm.rooms[1].id === -1) {
        // If we're on the main screen, and we're joined in a lobby
        // but not spectating one, then the only two visible tabs will
        // be general chat and "your lobby" chat, so the 2nd displayed
        // tab is the normally 3rd tab
        tabId = 2;
      }

      return tabId;
    }

    $rootScope.$on('chat-message', function (e, message) {
      var room = message.room;
      if (!angular.isDefined(vm.lastSeenIds[room])) {
        vm.lastSeenIds[room] = 0;
      }

      if (room === vm.rooms[currentTabId()].id) {
        vm.lastSeenIds[room] = Math.max(vm.lastSeenIds[room], message.id);
      }
    });

    $scope.$watch('currentTab', function (newVal, oldVal) {
      console.log('tab', newVal, oldVal, $scope.currentTab);
      var room = vm.rooms[currentTabId()];
      var msgs = room.messages;

      if (msgs.length > 0) {
        vm.lastSeenIds[room.id] = msgs[msgs.length - 1].id;
      }
    });

    vm.sendMessage = function(event) {
      if (vm.messageBox === "" || event.keyCode !== 13) {
        return;
      }

      if (vm.error) {
        Notifications.toast({message: 'That message is too long', error: true});
        return;
      }

      ChatService.send(vm.messageBox, vm.rooms[currentTabId()].id);

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
