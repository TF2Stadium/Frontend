/* @flow */
require('./ready-up.html');
require('./toast.html');

angular.module('tf2stadium.controllers')
  .controller('ToastController', ToastController);

/** @ngInject */
function ToastController($mdToast) {
  var vm = this;

  vm.executeAction = function () {
    $mdToast.hide('ok');
  };
}
