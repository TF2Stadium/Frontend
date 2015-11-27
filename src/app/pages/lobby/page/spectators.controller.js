(function () {
  'use strict';

  angular.module('tf2stadium')
    .controller('LobbyPageSpectatorsController', LobbyPageSpectatorsController);

  /** @ngInject */
  function LobbyPageSpectatorsController($scope, $state, $window,
                                         LobbyService) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getLobbySpectated();

    LobbyService.subscribe('lobby-spectated-updated', $scope, function () {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    vm.goToProfile = function (steamId) {
      $window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };

    vm.kick = function (playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, false);
    };

    vm.ban = function (playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, true);
    };

    vm.shouldShowSpectators = function () {
      return vm.lobbyInformation.id &&
        vm.lobbyInformation.id === parseInt($state.params.lobbyID);
    };
  }

})();
