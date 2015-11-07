(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('CurrentLobbyController', CurrentLobbyController);

  /** @ngInject */
  function CurrentLobbyController($state, $rootScope, $scope, LobbyService) {
    var vm = this;

    vm.visible = false;
    vm.lobbyInformation = LobbyService.lobbyJoined;

    vm.checkVisible = function() {
      vm.visible = vm.lobbyInformation.id && vm.lobbyInformation.id !== parseInt($state.params.lobbyID);
    };

    LobbyService.subscribe('lobby-joined-updated', $scope, function() {
      vm.lobbyInformation = LobbyService.lobbyJoined;
      vm.visible = vm.lobbyInformation.id;
      vm.checkVisible();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      vm.checkVisible();
    });
  }

})();
