(function() {
  'use strict';

  angular.module('tf2stadium').run(runBlock);

  /** @ngInject */

  function runBlock($log, $rootScope, Config, ThemeService, User) {

    $log.debug('runBlock end');

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState) {
        $rootScope.currentState = toState;

        //Forbid direct navigation to children states
        if (!fromState.name && toState.parent) {
          event.preventDefault();
          $state.go(toState.parent, toParams);
        }
      }
    );

    User.getProfile(function(profile) {
        $rootScope.userProfile = profile;
      }
    );

    $rootScope.config = Config;
  }

})();


