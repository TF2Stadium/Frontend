(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageHeaderController', LobbyPageHeaderController);

  /** @ngInject */
  function LobbyPageHeaderController($scope, LobbyService) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getLobbySpectated();

    LobbyService.subscribe('lobby-spectated-updated', $scope, function() {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    vm.closeLobby = function() {
      LobbyService.closeLobby(vm.lobbyInformation.id);
    };
  }

})();