(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageHeaderController', LobbyPageHeaderController);

  /** @ngInject */
  function LobbyPageHeaderController($scope, $state, LobbyService) {
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

    vm.shouldShowProgress = function() {
      return !error && !(vm.lobbyInformation.id && vm.lobbyInformation.id === parseInt($state.params.lobbyID));
    };

    vm.shouldShowError = function() {
      return error;
    };

  }

})();