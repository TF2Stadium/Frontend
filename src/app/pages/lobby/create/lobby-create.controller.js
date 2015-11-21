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

    /*
      Receives a field (e.g. lobbySettingsList.maps) and an option value
      (e.g. 'pl_upward'), finds the option in the field and checks
      if it's valid
    */
    var isSettingValid = function(field, optionValue) {
      var isValid = false;
      field.options.forEach(function(option) {
        if (option.value === optionValue) {
          isValid = vm.shouldShowOption(field, option);
        }
      });
      return isValid;
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

      //If we select something, we need to check if the next steps
      //have already been selected, and if they have, check that they're valid
      var checks = [
        {field: lobbySettingsList.maps, optionName: vm.lobbySettings.map},
        {field: lobbySettingsList.leagues, optionName: vm.lobbySettings.league},
        {field: lobbySettingsList.whitelists, optionName: vm.lobbySettings.whitelistID}        
      ];

      checks.forEach(function(check) {
        if (!isSettingValid(check.field, check.optionName)) {
          LobbyCreate.deleteSetting(check.field.key);
        }
      });

      vm.goToNext();
    };

    vm.goToNext = function() {
      $state.go(getNextWizardStep().name);
    };

    /*
      Looks at the other fields this option depends on in lobbySettingsList,
      then checks for each one of them
    */
    vm.shouldShowOption = function(optionGroup, option) {
      var shouldShow = option; //checks for empty option
      optionGroup.dependsOn.forEach(function(dependencyName) { //e.g. 'formats'
        var dependencyKey = lobbySettingsList[dependencyName].key; //e.g. 'type'
        var dependency = vm.lobbySettings[dependencyKey]; //e.g. 'highlander'
        shouldShow = shouldShow && option[dependency];
      });
      return shouldShow;
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
        vm.searchString = '';
        var searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }
    );

    LobbyCreate.clearLobbySettings();
  }

})();
