(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.controller('ReadyUpDialogController', ReadyUpDialogController);

  function ReadyUpDialogController($mdDialog, $timeout) {
    var vm = this;

    vm.seconds = 0;
    vm.limit = 300;

    vm.increaseCounter = function(){
      vm.seconds++;
      timer = $timeout(vm.increaseCounter,1000);

      if (vm.seconds > vm.limit) {
        $mdDialog.hide('leave');
      }
    };

    var timer = $timeout(vm.increaseCounter,1000);

    vm.action = function(action) {
      $mdDialog.hide(action);
    }
    
  }

})();