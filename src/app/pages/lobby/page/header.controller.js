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
      return !error && (vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID));
    };

    vm.shouldShowLobbyControls = function() {
      return vm.lobbyInformation.state < 5 &&
        $rootScope.userProfile.steamid === vm.lobbyInformation.leader.steamid || $rootScope.userProfile.role == 'administrator';
    };

    vm.shouldShowProgress = function() {
      return !error && !(vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID));
    };

    vm.shouldShowError = function() {
      return error;
    };

  }

})();