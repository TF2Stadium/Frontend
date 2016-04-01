angular.module('tf2stadium.controllers')
  .controller('LobbyCreateController', LobbyCreateController);

/** @ngInject */
function LobbyCreateController($document, $state, $scope, $rootScope,
                               $anchorScroll, $location,
                               LobbyCreate, Settings, Notifications,
                               PreloadService) {
  PreloadService.queuePreload('/assets/img/mumble.svg');
  PreloadService.queuePreload('/assets/img/not-mumble.svg');

  var vm = this;

  var lobbySettingsList = LobbyCreate.getSettingsList();
  for (var key in lobbySettingsList) {
    vm[key] = lobbySettingsList[key];
  }

  vm.wizardSteps = LobbyCreate.getSteps();
  vm.lobbySettings = LobbyCreate.getLobbySettings();
  LobbyCreate.subscribe('lobby-create-settings-updated', $scope, function () {
    vm.lobbySettings = LobbyCreate.getLobbySettings();
  });

  // used on the restrictions step
  vm.twitchRestriction = false;

  vm.showServers = false;
  vm.savedServers = {};
  vm.serverName = '';
  vm.servemeServer = {};

  function loadServers(settings) {
    vm.savedServers = angular.fromJson(settings.savedServers);
    vm.showServers = Object.keys(vm.savedServers).length > 0;
  };

  Settings.getSettings(loadServers);
  var handler = $rootScope.$on('settings-updated', function () {
    Settings.getSettings(loadServers);
  });
  $scope.$on('$destroy', handler);

  vm.preloadMaps = function (format) {
    lobbySettingsList['maps']
      .options
      .filter(function (map) { return map[format]; })
      .map(function (map) {
        return '/assets/img/maps/lobby-create/' + map.value + '.jpg';
      })
      .forEach(PreloadService.queuePreload);
  };

  vm.preloadImage = function (src) {
    PreloadService.queuePreload(src);
  };

  vm.loadSavedServer = function (name) {
    vm.serverName = name;

    // password saving intentionally left commented out: We want to
    // somehow offer that functionality, but are still discussing
    // different options and their security implications.
    var server = vm.savedServers[name];
    vm.lobbySettings.server = server.url;
    // vm.lobbySettings.rconpwd = server.password;
  };

  vm.saveServer = function (name) {
    vm.savedServers[name] = {
      url: vm.lobbySettings.server,
      // password: vm.lobbySettings.rconpwd
    };

    Settings.set('savedServers', angular.toJson(vm.savedServers), function () {
      Notifications.toast({
        message: 'Server saved.',
        hideDelay: 3000,
      });
    });
  };

  vm.updateTwitchRestriction = function () {
    vm.lobbySettings.twitchWhitelistSubs =
      vm.twitchRestriction === 'subs';
    vm.lobbySettings.twitchWhitelistFollows =
      vm.twitchRestriction === 'follows';
  };

  var getCurrentWizardStep = function () {
    var currentStep = vm.wizardSteps[0];
    vm.wizardSteps.forEach(function (wizardStep) {
      if (wizardStep.name === $state.current.name) {
        currentStep = wizardStep;
      }
    });
    return currentStep;
  };

  var getNextWizardStep = function () {
    var nextStep = vm.wizardSteps[0];
    vm.wizardSteps.forEach(function (wizardStep, index) {
      if (wizardStep.name === $state.current.name) {
        nextStep = vm.wizardSteps[index + 1];
      }
    });
    return nextStep;
  };

  function createHelper(settings, cb) {
    LobbyCreate.create(angular.copy(settings), function (response) {
      if (!response.success) {
        vm.requestSent = false;
      }
      if (cb) {
        cb(response);
      }
    });
    vm.requestSent = true;
  }

  vm.create = function () {
    createHelper(vm.lobbySettings);
  };

  vm.rentServeme = function rentServeme(startTime, endTime, server) {
    var settings = angular.extend({}, vm.lobbySettings, {
      serverType: 'serveme',
      serveme: {
        startsAt: startTime,
        endsAt: endTime,
        server: server
      }
    });

    vm.verifiedServer = true;
    createHelper(settings, function (response) {
      if (!response.success) {
        vm.verifiedServer = false;
      }
    });

    vm.serveMeServer = server;
    $location.hash('server-verify-box');
    $anchorScroll();
  };

  vm.rentStored = function rentStored(id) {
    var settings = angular.extend({}, vm.lobbySettings, {
      serverType: 'storedServer',
      server: id + '',
    });

    vm.verifiedServer = true;
    createHelper(settings, function (response) {
      if (!response.success) {
        vm.verifiedServer = false;
      }
    });
  };

  vm.verifyServer = function () {
    LobbyCreate.verifyServer(function (response) {
      vm.verifiedServer = response.success;
      vm.verifyServerError = !response.success;
      vm.verifyServerErrorMessage = response.message;
    });
  };

  vm.select = function (field, option) {
    LobbyCreate.set(field.key, option.value);
    vm.goToNext();
  };

  vm.isSelected = function (field, option) {
    return LobbyCreate.settings[field.key] === option.value;
  };

  vm.goToNext = function () {
    $state.go(getNextWizardStep().name);
  };

  vm.goToStart = function () {
    $state.go(vm.wizardSteps[0].name);
  };

  vm.shouldShowSearch = function () {
    var settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
    return settingsGroup && settingsGroup.filterable;
  };

  vm.searchAndInput = function () {
    var settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
    return settingsGroup && settingsGroup.allowCustomInput;
  };

  vm.shouldShowCustomOption = function (searchStr, options) {
    searchStr = vm.searchString && vm.searchString.toLowerCase();

    // If the custom input is an exact match to a predefined option,
    // don't show it as a duplicate option
    return searchStr && !options.some(function (x) {
      return x.value.toLowerCase() === searchStr;
    });
  };

  vm.storedServers = null;
  vm.servemeServers = null;

  vm.servemeRegionToFlag = {
    'fr': '/assets/img/emotes/emojione/1f1eb-1f1f7.png',
    'de': '/assets/img/emotes/emojione/1f1e9-1f1ea.png',
    'nl': '/assets/img/emotes/emojione/1f1f3-1f1f1.png',
    'us': '/assets/img/emotes/emojione/1f1fa-1f1f8.png',
  };

  $scope.$on('$destroy', $rootScope.$on('$stateChangeSuccess', function () {
    if ($state.current.name === 'server') {
      // see the step-server.html template for what this does
      vm.serverState = null;

      LobbyCreate
        .getStoredServers()
        .then(function (data) {
          vm.storedServers = data;
        });

      LobbyCreate
        .getServemeServers()
        .then(function (data) {
          // Normalized some weird backend data formatting:
          if (data.servers === null) {
            data.servers = [];
          }

          vm.servemeServers = data;
        });
    }

    // clear search input when navigating to a page
    vm.searchString = null;
    var searchInput = $document[0].getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
  }));

  $scope.$on('$destroy', $rootScope.$on('$stateChangeStart', function (e, toState) {
    if (toState.name === 'lobby-create') {
      // Redirect all navigations to the 'default' state to instead
      // go to the first step of the lobby create process
      e.preventDefault();
      vm.goToStart();
    }
  }));

  if ($state.current.name === 'lobby-create') {
    // Also redirect on initial laod of this controller, since the
    // stateChangeStart handler won't have been registered yet.
    vm.goToStart();
  }

  LobbyCreate.clearLobbySettings();
}
