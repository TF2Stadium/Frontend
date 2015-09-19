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
    };
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

    vm.verifyServer = function(address, password) {
      LobbyCreate.verifyServer (
        vm.lobbySettings.server, 
        vm.lobbySettings.rconpwd, 
        function(verified) {
          vm.verifiedServer = verified;
          vm.verifyServerError = !verified;
        }
      );
    }

    vm.select = function(field, option) {
      vm.lobbySettings[field.key] = option.value;
      vm.lobbySummary[field.title] = option.title || option.value;
      vm.goToNext();
    }

    vm.goToNext = function() {
      var state, stateName, stateParent, nextStepState;
      state = $state.current.name.split('.');
      stateName = state[1];
      stateParent = state[0];
      nextStepState = vm.wizardSteps[vm.wizardSteps.indexOf(stateName) + 1];
      $state.go(stateParent + '.' + nextStepState);
    }
  }

})();
