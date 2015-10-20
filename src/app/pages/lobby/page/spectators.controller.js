(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageSpectatorsController', LobbyPageSpectatorsController);

  /** @ngInject */
  function LobbyPageSpectatorsController($scope, LobbyService) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getLobbySpectated();

    LobbyService.subscribe('lobby-spectated-updated', $scope, function() {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    vm.goToProfile = function(steamId) {
      window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };

    vm.kick = function(playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, false);
    };

    vm.ban = function(playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, true);
    };
  }

})();