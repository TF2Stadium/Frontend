(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController(LobbyCreate, $state, $scope, $rootScope) {

    var vm = this;

    var lobbySettingsList = LobbyCreate.getSettingsList();
    for (var key in lobbySettingsList) {
      vm[key] = lobbySettingsList[key];
    }

    vm.wizardSteps = LobbyCreate.getSteps();
    vm.lobbySettings = LobbyCreate.getLobbySettings();
    LobbyCreate.subscribe('lobby-create-settings-updated', $scope, function() {
      vm.lobbySettings = LobbyCreate.getLobbySettings();
    });

    var getCurrentWizardStep = function() {
      var currentStep = vm.wizardSteps[0];
      vm.wizardSteps.forEach(function(wizardStep, index) {
        if (wizardStep.name === $state.current.name) {
          currentStep = wizardStep;
        }
      });
      return currentStep;
    };

    var getNextWizardStep = function() {
      var nextStep = vm.wizardSteps[0];
      vm.wizardSteps.forEach(function(wizardStep, index) {
        if (wizardStep.name === $state.current.name) {
          nextStep = vm.wizardSteps[index + 1];
        }
      });
      return nextStep;
    };

    vm.create = function() {
      LobbyCreate.create(vm.lobbySettings);
    };

    vm.verifyServer = function() {
      LobbyCreate.verifyServer(function(response) {
        vm.verifiedServer = response.success;
        vm.verifyServerError = !response.success;
        vm.verifyServerErrorMessage = response.message;
      });
    };

    vm.select = function(field, option) {
      LobbyCreate.set(field.key, option.value);
      vm.goToNext();
    };

    vm.goToNext = function() {
      $state.go(getNextWizardStep().name);
    };

    vm.shouldShowSearch = function() {
      var settingsGroup = lobbySettingsList[getCurrentWizardStep().groupKey];
      return settingsGroup && settingsGroup.filterable;
    };

    if ($state.current.name === 'lobby-create') {
      vm.goToNext();
    }

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState) {
        vm.searchString = null;
        var searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }
    );

    LobbyCreate.clearLobbySettings();
  }

})();
