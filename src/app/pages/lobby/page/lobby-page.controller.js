(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyPageController', LobbyPageController);

  /** @ngInject */
  function LobbyPageController($scope, LobbyService, Websocket) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getActive();

    LobbyService.subscribeActive($scope, function(){
      vm.lobbyInformation = LobbyService.getActive();
    });

    vm.join = function (lobby, team, position) {
      LobbyService.join(lobby, team, position);
    };

    vm.goToProfile = function(steamId) {
      window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };

    vm.kick = function(playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, false);
    };

    vm.ban = function(playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid, true);
    };

    LobbyService.subscribe('lobby-start', $scope, function(){
      alert("STARTED");
    });

  }

})();
