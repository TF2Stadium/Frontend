(function() {
  'use strict';

  angular.module('teamplaytf').run(runBlock);

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }

})();
