(function() {
  'use strict';
  
  angular.module('tf2stadium').run(runBlock);
  
  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();


