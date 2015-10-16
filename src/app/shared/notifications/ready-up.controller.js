(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('ReadyUpDialogController', ReadyUpDialogController);

  function ReadyUpDialogController($mdDialog, $interval) {
    var vm = this;

    vm.seconds = 0;

    var increaseCounter = function() {
      vm.seconds++;
      vm.percentage = 100 * vm.seconds / vm.timeout;

      if (vm.seconds >= vm.timeout) {
        $mdDialog.hide('leave');
      }
    };

    $interval(function () {
      increaseCounter();
    }, 1000);

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.accept = function() {
      $mdDialog.hide();
    };

  }

})();
