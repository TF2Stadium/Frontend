(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController(LobbyCreate, $state, $scope) {

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

    vm.create = function() {
      LobbyCreate.create(vm.lobbySettings);
    };

    vm.verifyServer = function() {
      LobbyCreate.verifyServer(function(isValid) {
        vm.verifiedServer = isValid;
        vm.verifyServerError = !isValid;
      });
    };

    vm.select = function(field, option) {
      LobbyCreate.set(field.key, option.value);
      vm.goToNext();
    };

    vm.goToNext = function() {
      var stepState, nextStepState;
      stepState = $state.current.name;
      nextStepState = vm.wizardSteps[vm.wizardSteps.indexOf(stepState) + 1];
      $state.go(nextStepState);
    };

    if ($state.current.name === 'lobby-create') {
      vm.goToNext();
    }

    LobbyCreate.clearLobbySettings();
  }

})();
