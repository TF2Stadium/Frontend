(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController(LobbyCreate, $state) {

    var vm = this;

    vm.lobbySettingsList = LobbyCreate.getSettingsList();
    vm.wizardSteps = LobbyCreate.getSteps();

    vm.lobbySettings = {
      server: 'tf2stadium.com:27031',
      rconpwd: '',
      type: 'highlander',
      mapName: 'koth_viaduct',
      whitelist: '3966',
      mumbleRequired: false,
      league: 'etf2l'
    };

    vm.create = function() {
      LobbyCreate.create(vm.lobbySettings);
    };

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
