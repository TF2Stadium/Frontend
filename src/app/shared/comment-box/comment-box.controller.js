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
        return false;
      }

      var room = 0;

      if (vm.currentTab !== 0) {
        room = vm.rooms.lobbySpectated.id;
      }

      ChatService.send(vm.messageBox, room);

      vm.messageBox = '';
      event.preventDefault();

    };

    vm.goToProfile = function(steamId) {
      window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };

    $rootScope.$on('$stateChangeStart',
      function(event, toState) {
        if (toState.name==='lobby-page') {
          vm.currentTab = 1;
        } else {
          vm.currentTab = 0;
        }
      }
    );

  }
})();
