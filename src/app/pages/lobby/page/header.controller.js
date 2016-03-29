angular.module('tf2stadium.controllers')
  .controller('LobbyPageHeaderController', LobbyPageHeaderController);

/** @ngInject */
function LobbyPageHeaderController($scope, $rootScope, $state,
                                   safeApply, LobbyService) {
  var vm = this;
  var lobbyPageId = parseInt($state.params.lobbyID);
  var error = false;

  var lobbyData$ = LobbyService.observeLobby(lobbyPageId);

  function updateLobbyData(lobbyData) {
    safeApply($scope, () => vm.lobbyInformation = lobbyData);
  }

  lobbyData$.onValue(updateLobbyData);
  $scope.$on('$destroy', () => lobbyData$.offValue(updateLobbyData));

  vm.closeLobby = function () {
    LobbyService.closeLobby(vm.lobbyInformation.id);
  };

  vm.resetServer = function () {
    LobbyService.resetServer(vm.lobbyInformation.id);
  };

  vm.shouldShowLobbyInformation = function () {
    return !error &&
      vm.lobbyInformation &&
      vm.lobbyInformation.id &&
      vm.lobbyInformation.id === parseInt($state.params.lobbyID);
  };

  vm.shouldShowLobbyControls = function () {
    var user = $rootScope.userProfile;
    var lobby = vm.lobbyInformation;
    return user && lobby && lobby.state < 5 &&
      (user.steamid === lobby.leader.steamid ||
       user.role === 'administrator');
  };

  vm.shouldShowProgress = function () {
    var lobby = vm.lobbyInformation;
    var curLobbyId = parseInt($state.params.lobbyID);
    return !error && !(lobby && lobby.id && lobby.id === curLobbyId);
  };

  vm.shouldShowError = function () {
    return error;
  };

}
