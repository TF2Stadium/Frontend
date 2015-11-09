(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyPageController', LobbyPageController);

  /** @ngInject */
  function LobbyPageController($scope, $state, LobbyService) {

    var vm = this;

    var buildConnectString = function() {
      if (!vm.lobbyJoinInformation.game) {
        return;
      }
      vm.lobbyJoinInformation.connectString =
        'connect ' + vm.lobbyJoinInformation.game.host +
        '; password ' + vm.lobbyJoinInformation.password;
    };

    var buildMumbleString = function() {
      if (!vm.lobbyJoinInformation.mumble) {
        return;
      }
      vm.lobbyJoinInformation.mumbleInformation =
        'IP address: ' + vm.lobbyJoinInformation.mumble.address +
        ', port ' + vm.lobbyJoinInformation.mumble.port + 
        ', password ' + vm.lobbyJoinInformation.mumble.password;
    };

    vm.lobbyInformation = LobbyService.getLobbySpectated();
    vm.lobbyJoinInformation = LobbyService.getLobbyJoinInformation();
    buildConnectString();
    buildMumbleString();
    vm.playerPreReady = LobbyService.getPlayerPreReady();
    vm.preReadyUpTimer = LobbyService.getPreReadyUpTimer();

    LobbyService.subscribe('lobby-spectated-updated', $scope, function() {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    LobbyService.subscribe('lobby-start', $scope, function(){
      vm.lobbyJoinInformation = LobbyService.getLobbyJoinInformation();
      buildConnectString();
      buildMumbleString();
    });

    $scope.$watch(LobbyService.getPlayerPreReady, function () {
      vm.playerPreReady = LobbyService.getPlayerPreReady();
    });

    $scope.$watch(LobbyService.getPreReadyUpTimer, function () {
      vm.preReadyUpTimer = LobbyService.getPreReadyUpTimer();
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

    vm.leaveSlot = function() {
      LobbyService.kick(vm.lobbyInformation.id, '', false);
    };

    vm.joinTF2Server = function() {
      LobbyService.joinTF2Server();
    };

    vm.joinMumbleServer = function() {
      LobbyService.joinMumbleServer();
    };

    vm.preReadyUp = function() {
       LobbyService.setPlayerPreReady(!LobbyService.getPlayerPreReady());
    };

    vm.shouldShowLobbyInformation = function() {
      return vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID);
    };

    LobbyService.spectate(parseInt($state.params.lobbyID));
  }

})();
