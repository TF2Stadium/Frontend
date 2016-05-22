require('./header.html');
require('./lobby-list.html');

angular
  .module('tf2stadium.controllers')
  .controller('LobbyListController', LobbyListController);

/** @ngInject */
function LobbyListController($rootScope, $scope, LobbyService, Settings, User) {
  var vm = this;

  function doesUserMeet(req) {
    if ($rootScope.userProfile && $rootScope.userProfile.steamid) {
      return $rootScope.userProfile.lobbiesPlayed >= req.lobbies &&
        $rootScope.userProfile.gameHours >= req.hours;
    } else {
      return true;
    }
  }

  function slotHasRestriction(slot) {
    return slot.requirements && (
      slot.requirements.hours || slot.requirements.lobbies) &&
      !doesUserMeet(slot.requirements);
  }

  var classHasPassword = klass => klass.red.password || klass.blu.password;

  function transformLobby(lobbyData) {
    lobbyData.hasAnyPasswords = lobbyData.classes.some(classHasPassword);

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

  function update() {
    vm.lobbies = transform(LobbyService.getList());
  }
  update();

  LobbyService.subscribe('lobby-list-updated', $scope, update);
  User.userProfile$.onValue(() => {
    update();
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
