(function() {
  'use strict';

  var app = angular.module('tf2stadium')
  app.controller('LobbyPageSpectatorsController', LobbyPageSpectatorsController);

  /** @ngInject */
  function LobbyPageSpectatorsController($scope, LobbyService, Websocket) {
    var vm = this;

    vm.spectators = LobbyService.getActive().spectators;

    LobbyService.subscribeActive($scope, function(){
      vm.spectators = LobbyService.getActive().spectators;
    });
  }

})();