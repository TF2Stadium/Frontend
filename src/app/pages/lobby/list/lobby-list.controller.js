(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($scope, LobbyService) {
    var vm = this;

    vm.lobbies=LobbyService.getList();

    // When we navigate to the main lobby list page, leave the
    // spectator spot for whatever lobby we were just in.
    LobbyService.leaveSpectatedLobby();

    vm.join = function (lobby, team, position, event) {
      event.preventDefault();
      event.stopImmediatePropagation();
      LobbyService.goToLobby(lobby);
      LobbyService.join(lobby, team, position);
    };

    LobbyService.subscribe('lobby-list-updated', $scope, function() {
      vm.lobbies = LobbyService.getList();
    });

  }
})();
