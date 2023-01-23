/* @flow */
import {isEmpty, isEqual, uniqWith, uniqBy, omit, get} from 'lodash';
import {property, identity} from 'lodash/fp';

angular.module('tf2stadium.controllers')
  .controller('LobbyCreateController', LobbyCreateController);

const requireMapImage = require.context('../../../../assets/img/maps/lobby-create/', true, /\.jpg$/);

/** @ngInject */
function LobbyCreateController($document, $state, $scope, $rootScope,
                               $anchorScroll, $location,
                               LobbyCreate, Settings, Notifications,
                               PreloadService) {
  PreloadService.queuePreload('/assets/img/mumble.svg');
  PreloadService.queuePreload('/assets/img/not-mumble.svg');
  PreloadService.queuePreload('/assets/img/logos/discord-logo-blurple.svg');

  var vm = this;

  var lobbySettingsList = LobbyCreate.getSettingsList();
  for (let key of Object.keys(lobbySettingsList)) {
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
  vm.recentConfigurations = [];
  vm.recentMaps = [];
  vm.savedConfigurations = [];
  vm.serverName = '';
  vm.servemeServer = {};
  vm.discord = false;

  function syncSettings() {
    Settings.getSettings((settings) => {
      vm.savedServers = angular.fromJson(settings.savedServers);
      vm.recentConfigurations = angular.fromJson(settings.recentConfigurations);
      vm.recentMaps = angular.fromJson(
        get(settings, 'recentMaps', [])
      ).map(name => ({value: name}));
      vm.savedConfigurations = angular.fromJson(settings.savedConfigurations);
      vm.showServers = !isEmpty(vm.savedServers);
      vm.hasRecentConfigurations = !isEmpty(vm.recentConfigurations);
      vm.hasSavedConfigurations = !isEmpty(vm.savedConfigurations);
    });
  }

  syncSettings();
  var handler = $rootScope.$on('settings-updated', syncSettings);
  $scope.$on('$destroy', handler);

  function loadMapImage(mapName, imageType) {
    const allAssets = new Set(requireAsset.keys());
    let url = `./lobby-create/${mapName}.jpg`;
    if (!known.has(url)) {
      url = url.replace(/_(final|rc*|beta*)\.jpg$/, '.jpg');
    }
    if (known.has(url)) {
      return requireAsset(url);
    }

  }

  vm.preloadMaps = function (format) {
    lobbySettingsList
      .maps
      .options
      .filter(map => map[format])
      .map(map => requireMapImage(`./${map.value}.jpg`))
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
    vm.lobbySettings.rconpwd = server.password;
  };

  vm.saveServer = function (name, url, password) {
    console.log('save', name, url, password);
    vm.savedServers[name] = {url, password};
    Settings.set('savedServers', angular.toJson(vm.savedServers), function () {
      Notifications.toast({
        message: 'Server saved.',
        hideDelay: 3000,
      });
    });
  };

  vm.updateTwitchRestriction = function () {
    vm.lobbySettings.twitchWhitelistSubs = (vm.twitchRestriction === 'subs');
    vm.lobbySettings.twitchWhitelistFollows = (vm.twitchRestriction === 'follows');
  };

  var getCurrentWizardStep = function () {
    var currentStep = vm.wizardSteps[0];
    vm.wizardSteps.forEach((wizardStep) => {
      if (wizardStep.name === $state.current.name) {
        currentStep = wizardStep;
      }
    });
    return currentStep;
  };

  var getNextWizardStep = function () {
    var nextStep = vm.wizardSteps[0];
    vm.wizardSteps.forEach((wizardStep, index) => {
      if (wizardStep.name === $state.current.name) {
        nextStep = vm.wizardSteps[index + 1];
      }
    });
    return nextStep;
  };

  function createHelper(lobbySettings, cb) {
    let newRecentConfigurations = vm.recentConfigurations.slice();
    if (!angular.isArray(newRecentConfigurations)) {
      newRecentConfigurations = [];
    }

    const newRecentConfig = omit(
      angular.copy(lobbySettings),
      'server',
      'rconpwd',
      'serverType',
      'serveme'
    );
    if (newRecentConfig.mumbleRequired !== 'discord') {
      newRecentConfig.discord = {};
    }
    newRecentConfigurations.unshift(newRecentConfig);
    newRecentConfigurations = uniqWith(newRecentConfigurations, isEqual);

    Settings.set('recentConfigurations',
                 angular.toJson(newRecentConfigurations.slice(0, 8)));

    vm.recentMaps = uniqBy([{value: lobbySettings.map}].concat(vm.recentMaps), 'value').slice(0, 5);
    Settings.set('recentMaps', angular.toJson(vm.recentMaps.map(property('value'))));

    const payload = angular.copy(lobbySettings);
    if (payload.mumbleRequired === 'discord') {
      payload.mumbleRequired = false;
    } else {
      delete payload.discord;
    }
    LobbyCreate.create(payload, function (response) {
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
    var settings = Object.assign({}, vm.lobbySettings, {
      serverType: 'serveme',
      serveme: {
        startsAt: startTime,
        endsAt: endTime,
        server: server,
      },
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
    var settings = Object.assign({}, vm.lobbySettings, {
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

  vm.loadSettings = function (newSettings) {
    Object.keys(newSettings).forEach(key => {
      LobbyCreate.set(key, newSettings[key]);
    });
    LobbyCreate.set('saved', true);
    LobbyCreate.set('restrictionsSet', true);

    $state.go(vm.wizardSteps[vm.wizardSteps.length - 1].name);
  };

  vm.addFavoriteSettings = function (newSettings) {
    let newFavoriteConfigurations = angular.copy(vm.savedConfigurations);
    if (!angular.isArray(newFavoriteConfigurations)) {
      newFavoriteConfigurations = [];
    }
    newFavoriteConfigurations.push(angular.copy(newSettings));

    Settings.set('savedConfigurations',
                 angular.toJson(newFavoriteConfigurations));
  };

  vm.removeFavoriteSettings = function (index) {
    let newFavoriteConfigurations = angular.copy(vm.savedConfigurations);
    if (!angular.isArray(newFavoriteConfigurations)) {
      newFavoriteConfigurations = [];
    }
    newFavoriteConfigurations.splice(index, 1);

    Settings.set('savedConfigurations',
                 angular.toJson(newFavoriteConfigurations));
  };

  vm.isSelected = function (field, option) {
    return LobbyCreate.settings[field.key] === option.value;
  };

  vm.goToNext = function () {
    $state.go(getNextWizardStep().name);
  };

  vm.goToStart = function () {
    if (vm.hasSavedConfigurations || vm.hasRecentConfigurations) {
      $state.go(vm.wizardSteps[0].name);
    } else {
      $state.go(vm.wizardSteps[1].name);
    }
  };

  vm.shouldShowSearch = function () {
    var settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
    return settingsGroup && settingsGroup.filterable;
  };

  vm.searchAndInput = function () {
    var settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
    return settingsGroup && settingsGroup.allowCustomInput;
  };

  vm.searchBoxPlaceholder = () => {
    const settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
    return settingsGroup.searchLabel || (
      `Search${settingsGroup.allowCustomInput ? ' or Input' : ''}...`
    );
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
    // Also redirect on initial load of this controller, since the
    // stateChangeStart handler won't have been registered yet.
    vm.goToStart();
  }

  LobbyCreate.clearLobbySettings();
}
