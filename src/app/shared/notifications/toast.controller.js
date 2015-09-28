(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('ToastController', ToastController);

  /** @ngInject */
  function ToastController($mdToast) {
    var vm = this;

    vm.hide = function() {
      $mdToast.hide();
    };
    
  }

})();
