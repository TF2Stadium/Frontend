(function () {
  'use strict';

  angular.module('tf2stadium')
    .controller('ToastController', ToastController);

  /** @ngInject */
  function ToastController($mdToast) {
    var vm = this;

    vm.executeAction = function () {
      vm.action();
      $mdToast.hide();
    };
  }

})();
