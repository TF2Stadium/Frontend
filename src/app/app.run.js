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

        if (toState.name == 'lobby-page'
            && ( angular.equals({}, LobbyService.getActive()) || LobbyService.getActive().id != toParams.lobbyID) ) {
          Notifications.toast({message: "Can't spectate lobby " + toParams.lobbyID, error: true});
          event.preventDefault();
          $state.go('lobby-list');
        }
      }
    );

    $rootScope.$on('lobby-active-updated', function() {
      if (angular.equals({}, LobbyService.getActive()) && $rootScope.currentState=='lobby-page') {
        $state.go('lobby-list');
      }
    });

    User.init();

    $rootScope.config = Config;
    
    Settings.getSettings(function(settings) {
      $rootScope.currentTheme = settings.currentTheme;
    });

  }

})();


