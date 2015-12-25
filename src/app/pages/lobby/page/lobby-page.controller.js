(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('LobbyPageController', LobbyPageController);

  /** @ngInject */
  function LobbyPageController($scope, $state, $window, LobbyService, $timeout) {

    var vm = this;

    var buildConnectString = function () {
      if (!vm.lobbyJoinInformation.game) {
        return;
      }
      vm.lobbyJoinInformation.connectString =
        'connect ' + vm.lobbyJoinInformation.game.host +
        '; password ' + vm.lobbyJoinInformation.password;
    };

    var buildMumbleString = function () {
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

    LobbyService.subscribe('lobby-spectated-updated', $scope, function () {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    LobbyService.subscribe('lobby-start', $scope, function (){
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

    $scope.$on('$destroy', function (){
      LobbyService.leaveSpectatedLobby();
    });

    vm.slotClicked = function (slotScope, event) {
      if (vm.lobbyInformation.password) {
        slotScope.showPasswordBox = true;
        //Wrapped in a timeout because of ng-if DOM manipulation
        $timeout((function () {
          var input = event.target.getElementsByClassName('slot-password-input')[0];
          input.focus();
        }), 0);
      }
      /*
        We try to join the slot anyway.
        If it fails, it means we're not in the whitelist,
        so we show the password input.
        If it works, the password input will disappear and the slot info will show up.

        This will show an error toast, so it should be fixed.
      */
      vm.join(slotScope);
    };

    vm.onPasswordInputBlur = function (slotScope) {
      slotScope.slotPassword = undefined;
      slotScope.showPasswordBox = false;
    };

    vm.onPasswordInputKeydown = function (slotScope, event) {
      if (event.keyCode !== 13) { //not Enter
        return;
      }

      event.preventDefault();
      vm.onPasswordInputBlur();
      vm.join(slotScope);
    };

    vm.join = function (slotScope) {
      LobbyService.join(vm.lobbyInformation.id, slotScope.team, slotScope.class.class, slotScope.slotPassword);
    };

    vm.goToProfile = function (steamId) {
      $window.open('http://steamcommunity.com/profiles/' + steamId, '_blank');
    };

    vm.kick = function (playerSummary) {
      LobbyService.kick(vm.lobbyInformation.id, playerSummary.steamid);
    };

    vm.ban = function (playerSummary) {
      LobbyService.ban(vm.lobbyInformation.id, playerSummary.steamid);
    };

    vm.leaveSlot = function () {
      LobbyService.leaveSlot(vm.lobbyInformation.id);
    };

    vm.joinTF2Server = function () {
      LobbyService.joinTF2Server();
    };

    vm.joinMumbleServer = function () {
      LobbyService.joinMumbleServer();
    };

    vm.preReadyUp = function () {
      LobbyService.setPlayerPreReady(!LobbyService.getPlayerPreReady());
    };

    vm.shouldShowLobbyInformation = function () {
      return vm.lobbyInformation && vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID);
    };

    LobbyService.spectate(parseInt($state.params.lobbyID));
  }

})();
