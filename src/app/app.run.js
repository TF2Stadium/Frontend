(function() {
  'use strict';
  
  angular.module('tf2stadium').run(runBlock);
  
  /** @ngInject */
  function runBlock($log, $rootScope, Config) {
    $log.debug('runBlock end');
    
    $rootScope.$on('$stateChangeStart',
      function(event, toState){
        $rootScope.currentState = toState;
      }
    );

    $rootScope.config = Config;
  }

})();


