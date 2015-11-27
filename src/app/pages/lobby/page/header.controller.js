(function () {
  'use strict';

  angular.module('tf2stadium')
    .controller('LobbyPageHeaderController', LobbyPageHeaderController);

  /** @ngInject */
  function LobbyPageHeaderController($scope, $rootScope, $state,
                                     LobbyService) {
    var vm = this;
    var error = false;

    vm.lobbyInformation = LobbyService.getLobbySpectated();

    LobbyService.subscribe('lobby-spectated-updated', $scope, function () {
      vm.lobbyInformation = LobbyService.getLobbySpectated();
    });

    vm.closeLobby = function () {
      LobbyService.closeLobby(vm.lobbyInformation.id);
    };

    vm.resetServer = function () {
      LobbyService.resetServer(vm.lobbyInformation.id);
    };

    vm.shouldShowLobbyInformation = function () {
      return !error &&
        vm.lobbyInformation.id &&
        vm.lobbyInformation.id === parseInt($state.params.lobbyID);
    };

    vm.shouldShowLobbyControls = function () {
      var user = $rootScope.userProfile;
      var lobby = vm.lobbyInformation;
      return lobby.state < 5 && user &&
        (user.steamid === lobby.leader.steamid ||
         user.role === 'administrator');
    };

    vm.shouldShowProgress = function () {
      return !error &&
        !(vm.lobbyInformation.id &&
          vm.lobbyInformation.id === parseInt($state.params.lobbyID));
    };

    vm.shouldShowError = function () {
      return error;
    };

  }

})();
