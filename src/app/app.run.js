(function() {
  'use strict';

  angular.module('tf2stadium').run(runBlock);

  /** @ngInject */

  function runBlock(Config, User, Settings, $log, $state, $rootScope, LobbyService, Notifications, $mdDialog) {

    $log.debug('runBlock end');

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState) {
        $rootScope.currentState = toState.name;

        //Forbid direct navigation to children states
        if (!fromState.name && toState.parent === 'lobby-create') {
          event.preventDefault();
          $state.go(toState.parent, toParams);
        }

        if (toState.redirectTo) {
          event.preventDefault();
          $state.go(toState.redirectTo);          
        }
      }
    );

    User.init();

    $rootScope.config = Config;
    Settings.getSettings(function(settings) {
      $rootScope.currentTheme = settings.currentTheme;
    });

    new Clipboard('.clipboard-button').on('success', function(event) {
      Notifications.toast({message: 'Text copied to clipboard'});
    });

    if (window.addEventListener) {
      window.addEventListener("storage", onStorageChanged, false);
    } else {
      window.attachEvent("onstorage", onStorageChanged);
    }

    function onStorageChanged(event) {
      if (event.key !== 'tabCommunication') {
        return;
      }

      if (event.newValue === 'closeDialog') {
        $mdDialog.hide();
      }
    }

  }

})();


