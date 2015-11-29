(function () {
  'use strict';

  angular.module('tf2stadium')
    .controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController($document, $state, $scope, $rootScope,
                                 LobbyCreate) {

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

    vm.shouldShowSearch = function () {
      var settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
      return settingsGroup && settingsGroup.filterable;
    };

    if ($state.current.name === 'lobby-create') {
      vm.goToNext();
    }

    var clearStateChange = $rootScope.$on('$stateChangeSuccess',
      function () {
        vm.searchString = null;
        var searchInput = $document[0].getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
        }
      });
    $scope.$on('$destroy', clearStateChange);

    LobbyCreate.clearLobbySettings();
  }

})();
