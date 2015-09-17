(function() {
  'use strict';

  angular.module('tf2stadium').run(runBlock);

  /** @ngInject */
  function runBlock($log, $rootScope, Config, ThemeService, User) {
    $log.debug('runBlock end');

    $rootScope.$on('$stateChangeStart',
      function(event, toState){
        $rootScope.currentState = toState;
      }
    );

    User.getProfile(function(profile) {
        $rootScope.userProfile = profile;
      }
    );

    $rootScope.config = Config;
  }

})();


