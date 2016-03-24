angular
  .module('tf2stadium')
  .controller('RulesPageController', RulesPageController);

/** @ngInject */
function RulesPageController(RulesPage) {
  var vm = this;

  vm.setCurrent = function (key) {
    vm.current = key;
  };

  vm.sections = RulesPage.getSections();
}
