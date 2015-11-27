(function () {
  'use strict';

  angular.module('tf2stadium')
    .controller('CurrentLobbyController', CurrentLobbyController);

  /** @ngInject */
  function CurrentLobbyController($state, $rootScope, $scope, LobbyService) {
    var vm = this;

    vm.visible = false;
    vm.lobbyInformation = LobbyService.getLobbyJoined();

    vm.checkVisible = function () {
      vm.visible = vm.lobbyInformation.id && vm.lobbyInformation.id !== parseInt($state.params.lobbyID);
    };

    LobbyService.subscribe('lobby-joined-updated', $scope, function () {
      vm.lobbyInformation = LobbyService.getLobbyJoined();
      vm.visible = vm.lobbyInformation.id;
      vm.checkVisible();
    });

    var clearStateChange = $rootScope.$on('$stateChangeSuccess', function () {
      vm.checkVisible();
    });
    $scope.$on('$destroy', clearStateChange);
  }

})();
