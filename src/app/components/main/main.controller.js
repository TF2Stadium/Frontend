(function() {
  'use strict';

  angular
    .module('teamplaytf')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout) {
    var vm = this;

    vm.sendMessage = function() {
      alert("hello");
    }
  }
})();
