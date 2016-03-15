(function () {
  'use strict';

  angular.module('tf2stadium.controllers')
    .controller('ReadyUpDialogController', ReadyUpDialogController);

  function ReadyUpDialogController($scope, $mdDialog, $interval) {
    var vm = this;

    vm.percentage = 0;
    vm.readyUpMs = vm.timeout * 1000;

    var increaseCounter = function () {
      var d = (Date.now() - vm.startTime);
      vm.percentage = 100 * (d / vm.readyUpMs);

      if (vm.percentage > 100) {
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
    }, 100);

    $scope.$on('$destroy', function readyUpDialogDestroyed() {
      $interval.cancel(timer);
    });
  }

})();
