(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageSpectatorsController', LobbyPageSpectatorsController);

  /** @ngInject */
  function LobbyPageSpectatorsController($scope, LobbyService) {
    var vm = this;

    vm.spectators = LobbyService.getLobbySpectated().spectators;

    LobbyService.subscribeLobbySpectated($scope, function(){
      vm.spectators = LobbyService.getLobbySpectated().spectators;
    });
  }

})();