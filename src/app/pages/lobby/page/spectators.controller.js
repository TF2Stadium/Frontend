(function () {
  'use strict';

  angular.module('tf2stadium.controllers')
    .controller('LobbyPageSpectatorsController', LobbyPageSpectatorsController);

  /** @ngInject */
  function LobbyPageSpectatorsController($scope, $state, $window,
                                         safeApply, LobbyService) {
    var vm = this;
    var lobbyPageId = parseInt($state.params.lobbyID);
    var error = false;

    LobbyService
      .observeLobby(lobbyPageId)
      .onValue(function (lobbyData) {
        safeApply($scope, function () {
          vm.lobbyInformation = lobbyData;
        });
      });

    vm.goToSteamProfile = function (steamId) {
      $window.open('https://steamcommunity.com/profiles/' + steamId, '_blank');
    };

    vm.kick = function (playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, false);
    };

    vm.ban = function (playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, true);
    };

    vm.shouldShowSpectators = function () {
      return vm.lobbyInformation &&
        vm.lobbyInformation.id &&
        vm.lobbyInformation.id === parseInt($state.params.lobbyID);
    };
  }

})();
