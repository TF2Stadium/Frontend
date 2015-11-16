(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageHeaderController', LobbyPageHeaderController);

  /** @ngInject */
  function LobbyPageHeaderController($scope, $rootScope, $state, LobbyService) {
    var vm = this;
    var error = false;

    vm.lobbyInformation = LobbyService.getLobbySpectated();

    LobbyService.subscribe('lobby-spectated-updated', $scope, function() {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    vm.closeLobby = function() {
      LobbyService.closeLobby(vm.lobbyInformation.id);
    };

    vm.shouldShowLobbyInformation = function() {
      return !error && (vm.lobbyInformation && vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID));
    };

    vm.shouldShowLobbyControls = function() {
      if (!vm.lobbyInformation || vm.lobbyInformation.state >= 5) {
        return false;
      }

      if (typeof $rootScope.userProfile === 'undefined') {
        return false;
      }

      var user = $rootScope.userProfile;
      var leader = vm.lobbyInformation.leader;
      return user.steamid === leader.steamid || user.role === 'administrator';
    };

    vm.shouldShowProgress = function() {
      return !error && !(vm.lobbyInformation && vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID));
    };

    vm.shouldShowError = function() {
      return error;
    };

  }

})();
