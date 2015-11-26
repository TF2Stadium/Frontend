(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($scope, LobbyService) {
    var vm = this;

    vm.lobbies = LobbyService.getList();
    LobbyService.subscribe('lobby-list-updated', $scope, function() {
      vm.lobbies = LobbyService.getList();
    });

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
