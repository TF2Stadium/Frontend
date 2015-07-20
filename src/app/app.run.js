(function() {
  'use strict';
  
  angular.module('teamplay').run(runBlock);
  
  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();


