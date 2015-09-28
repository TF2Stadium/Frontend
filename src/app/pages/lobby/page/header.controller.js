(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyPageHeaderController', LobbyPageHeaderController);

  /** @ngInject */
  function LobbyPageHeaderController($scope, LobbyService) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getActive();

    LobbyService.subscribeActive($scope, function(){
      vm.lobbyInformation = LobbyService.getActive();
    });
  }

})();