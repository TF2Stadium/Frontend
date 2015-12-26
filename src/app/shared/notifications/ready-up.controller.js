(function () {
  'use strict';

  angular.module('tf2stadium.controllers')
    .controller('ReadyUpDialogController', ReadyUpDialogController);

  function ReadyUpDialogController($scope, $mdDialog, $interval) {
    var vm = this;

    vm.seconds = 0;

    var increaseCounter = function () {
      vm.seconds++;
      vm.percentage = 100 * vm.seconds / vm.timeout;

      if (vm.seconds >= vm.timeout) {
        $mdDialog.hide('leave');
      }
    };

    vm.cancel = function () {
      $mdDialog.cancel();
    };

    vm.accept = function () {
      $mdDialog.hide({readyUp: true});
    };

    var timer = $interval(function () {
      increaseCounter();
    }, 1000);

    $scope.$on('$destroy', function readyUpDialogDestroyed() {
      $interval.cancel(timer);
    });

  }

})();
