(function() {
  'use strict';
  
  angular.module('tf2stadium').run(runBlock);
  
  /** @ngInject */
  function runBlock($log, $rootScope, ThemeService) {
    $log.debug('runBlock end');
    
    $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      $rootScope.currentState = toState;
    });
  }

})();


