(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('WizardStepsController', WizardStepsController);

  /** @ngInject */
  function WizardStepsController(LobbyCreate, $rootScope) {

    var vm = this;
    vm.steps = LobbyCreate.getSteps();

    vm.isEnabled = function(step) {
      return vm.steps.indexOf(step) <= vm.steps.indexOf($rootScope.currentState);
    }

  }

})();
