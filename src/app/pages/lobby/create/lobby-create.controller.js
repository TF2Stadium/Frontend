(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController(LobbyCreate, $state) {

    var vm = this;

    var lobbySettingsList = LobbyCreate.getSettingsList();
    for (var key in lobbySettingsList) {
      vm[key] = lobbySettingsList[key];
    }
    vm.wizardSteps = LobbyCreate.getSteps();

    vm.lobbySettings = {
      server: 'tf2stadium.com:27031',
      rconpwd: ''
    };

    vm.lobbySummary = {};
    vm.verifyServer = false;

    vm.create = function() {
      LobbyCreate.create(vm.lobbySettings);
    };

    vm.verifyServer = function() {
      LobbyCreate.verifyServer (
        vm.lobbySettings.server, 
        vm.lobbySettings.rconpwd, 
        function(verified) {
          vm.verifiedServer = verified;
          vm.verifyServerError = !verified;
        }
      );
    };

    vm.select = function(field, option) {
      vm.lobbySettings[field.key] = option.value;
      vm.lobbySummary[field.title] = option.title || option.value;
      vm.goToNext();
    };

    vm.goToNext = function() {
      var stepState, nextStepState;
      stepState = $state.current.name;
      nextStepState = vm.wizardSteps[vm.wizardSteps.indexOf(stepState) + 1];
      $state.go(nextStepState);
    };

    vm.goToNext();
  }

})();
