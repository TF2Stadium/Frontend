(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('WizardStepsController', WizardStepsController);

  /** @ngInject */
  function WizardStepsController(LobbyCreate, $state) {

    var vm = this;
    vm.steps = LobbyCreate.getSteps();

  }

})();
