(function() {
  'use strict';

  angular
  .module('tf2stadium')
  .filter('capitalize', capitalize);

  /** @ngInject */
  function capitalize() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    }
  }

})();