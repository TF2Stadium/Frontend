require('./header.html');
require('./lobby-list.html');

angular
  .module('tf2stadium.controllers')
  .controller('LobbyListController', LobbyListController);

/** @ngInject */
function LobbyListController($scope, LobbyService, Settings) {
  var vm = this;

  function slotHasRestriction(slot) {
    return slot.requirements && (
      slot.requirements.hours || slot.requirements.lobbies);
  }

  function transformLobby(lobbyData) {
    lobbyData.hasAnyPasswords = lobbyData.classes.some((klass) => {
      return klass.red.password || klass.blue.password;
    });

    lobbyData.classes = lobbyData.classes.map((klass) => {
      klass.red.isRestricted = slotHasRestriction(klass.red);
      klass.blu.isRestricted = slotHasRestriction(klass.blu);
      return klass;
    });

    return lobbyData;
  }

  function transform(lobbyListData) {
    return lobbyListData.map(transformLobby);
  }

  vm.lobbies = transform(LobbyService.getList());
  LobbyService.subscribe('lobby-list-updated', $scope, function () {
    vm.lobbies = transform(LobbyService.getList());
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
