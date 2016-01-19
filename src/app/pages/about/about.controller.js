(function () {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('AboutPageController', AboutPageController);

  /** @ngInject */
  function AboutPageController(AboutPage) {
    var vm = this;

    vm.setCurrent = function (key) {
      vm.current = key;
    };

    vm.sections = AboutPage.getSections();
  }

})();
