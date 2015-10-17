(function() {
  'use strict';

  angular.module('tf2stadium').run(runBlock);

  /** @ngInject */

  function runBlock(Config, User, Settings, $log, $state, $rootScope, LobbyService, Notifications) {

    $log.debug('runBlock end');

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState) {
        $rootScope.currentState = toState.name;

        //Forbid direct navigation to children states
        if (!fromState.name && toState.parent) {
          event.preventDefault();
          $state.go(toState.parent, toParams);
        }
      }
    );

    User.init();

    $rootScope.config = Config;
    Settings.getSettings(function(settings) {
      $rootScope.currentTheme = settings.currentTheme;
    });

  }

})();


