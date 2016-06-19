/* @flow */
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
      $mdDialog.cancel();
    }
  };

  vm.cancel = () => $mdDialog.cancel();
  vm.accept = () => $mdDialog.hide({ readyUp: true });

  var timer = $interval(increaseCounter, 100);
  $scope.$on('$destroy', () => $interval.cancel(timer));
}
