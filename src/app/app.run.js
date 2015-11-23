(function() {
  'use strict';

  angular.module('tf2stadium').run(runBlock);

  /** @ngInject */

  function runBlock(Config, User, Settings, $timeout, $log,
    $state, $rootScope, LobbyService, Notifications, $mdDialog) {

    $log.debug('runBlock end');

    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState) {
        $rootScope.currentState = toState.name;

        //Forbid direct navigation to children states
        if (toState.parent === 'lobby-create') {
          //We allow navigation from the children states to other children states
          if (fromState.parent !== 'lobby-create' && fromState.name !== 'lobby-create') {
            event.preventDefault();
            $state.go(toState.parent, toParams);
          }
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
      $rootScope.themeLoaded = true;
    });

    //If the websocket is dead, we still need to show the page.
    $timeout(function() {
      $rootScope.themeLoaded = true;
    }, 1000);

    $rootScope.$on('socket-opened', function() {
      $rootScope.backendAuthenticated = true;
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

    //We check if the user allowed us to show notifications
    //If he didn't set the permissions yet, we ask him to do so
    $timeout(function() {
      if (Notification.permission !== 'default') {
        return;
      }
      Notifications.toast({
        message: 'You need to allow us to show you browser notifications',
        actionMessage: 'Set permissions',
        action: function() {
          Notifications.notifyBrowser({
            title: 'HTML5 notifications enabled!',
            timeout: 3,
            showAlways: true
          });
          }
        });
    }, 2000);

  }

})();
