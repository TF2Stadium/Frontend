(function () {
  'use strict';

  angular.module('tf2stadium.controllers')
    .controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController($document, $state, $scope, $rootScope,
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

    vm.showServers = false;
    vm.savedServers = {};
    vm.serverName = '';

    function loadServers(settings) {
      vm.savedServers = angular.fromJson(settings.savedServers);
      vm.showServers = Object.keys(vm.savedServers).length > 0;
    }

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
        url: vm.lobbySettings.server // ,
        // password: vm.lobbySettings.rconpwd
      };

      Settings.set('savedServers', angular.toJson(vm.savedServers), function () {
        Notifications.toast({
          message: 'Server saved.',
          hideDelay: 3000
        });
      });
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

    vm.create = function () {
      LobbyCreate.create(vm.lobbySettings, function (response) {
        if (!response.success) {
          vm.requestSent = false;
        }
      });
      vm.requestSent = true;
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

    $scope.$on('$destroy', $rootScope.$on('$stateChangeSuccess', function () {
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

})();
