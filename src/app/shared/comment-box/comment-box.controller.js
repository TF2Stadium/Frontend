(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('CommentBoxController', CommentBoxController);

  /** @ngInject */
  function CommentBoxController ($scope, $rootScope, ChatService, LobbyService) {
    var vm = this;

    vm.rooms = ChatService.getRooms();
    vm.currentTab = 0;
    vm.joinedLobby = false;

    LobbyService.subscribe('lobby-spectated-updated', $scope, function() {
      vm.joinedLobby = LobbyService.getLobbySpectated().id;
    });

    vm.sendMessage = function(event) {

      if (vm.messageBox === "" || event.keyCode !== 13) {
        return false;
      }

      var room = 0;

      if (vm.currentTab !== 0) {
        room = vm.joinedLobby;
      }

      ChatService.send(vm.messageBox, room);

      vm.messageBox = '';
      event.preventDefault();

    };

    $rootScope.$on('$stateChangeStart',
      function(event, toState) {
        console.log(toState);
        if (toState.name==='lobby-page') {
          vm.currentTab = 1;
        } else {
          vm.currentTab = 0;
        }
      }
    );

    vm.goToProfile = function(steamId) {
      window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };

  }
})();
