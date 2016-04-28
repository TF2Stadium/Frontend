require('./header.html');
require('./lobby-list.html');

angular
  .module('tf2stadium.controllers')
  .controller('LobbyListController', LobbyListController);

/** @ngInject */
function LobbyListController($scope, LobbyService, Settings) {
  var vm = this;

  vm.lobbies = LobbyService.getList();
  LobbyService.subscribe('lobby-list-updated', $scope, function () {
    vm.lobbies = LobbyService.getList();
  });

  vm.shouldShowFilters = function () {
    var shouldShow;
    Settings.getSettings(function (settings) {
      shouldShow = settings.filtersEnabled;
    });
    return shouldShow;
  };

  vm.showFilters = function () {
    Settings.set('filtersEnabled', true);
  };

  vm.join = function (lobby, team, position, event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    LobbyService.goToLobby(lobby);
    LobbyService.join(lobby, team, position);
  };

  LobbyService.subscribe('lobby-list-updated', $scope, function () {
    vm.lobbies = LobbyService.getList();
  });

}
