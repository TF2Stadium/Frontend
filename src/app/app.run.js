/* @flow */
import Clipboard from 'clipboard';

angular
  .module('tf2stadium')
  .run(runBlock);

/** @ngInject */
function runBlock($timeout: AngularJSTimeout, $window, $state, $rootScope, $log: AngularJSLog,
                  $location, $mdDialog,
                  Websocket, PreloadService, Config,
                  User, Settings, LobbyService, Notifications, safeApply) {
  // Google Analytics
  // big TODO: move this to a build variable
  $window.ga('create', 'UA-65920939-1', 'auto');

  /* eslint-disable angular/on-watch */
  /* the angular/on-watch warning doesn't apply to run blocks */
  $rootScope.$on('$stateChangeSuccess', function () {
    $window.ga('send', 'pageview', $location.path());
  });

  $rootScope.$on('$stateChangeStart', (event, toState, toParams, fromState) => {
    $rootScope.currentState = toState.name;

    // Forbid direct navigation to children states
    if (toState.parent === 'lobby-create') {
      // We allow navigation from the children states to other
      // children states
      if (fromState.parent !== 'lobby-create' &&
          fromState.name !== 'lobby-create') {
        event.preventDefault();
        $state.go(toState.parent, toParams);
      }
    }

    if (toState.redirectTo) {
      event.preventDefault();
      $state.go(toState.redirectTo);
    }
  });

  User.init();

  $rootScope.config = Config;

  var syncHandler = false;
  function syncGlobalSettings() {
    Settings.getSettings((settings) => {
      safeApply($rootScope, () => {
        $rootScope.currentTheme = settings.currentTheme;
        $rootScope.currentTimestampsOption = settings.timestamps;
        $rootScope.animationLength = settings.animationLength;
        $rootScope.themeLoaded = true;
      });
    });

    if (!syncHandler) {
      syncHandler = $rootScope.$on('settings-updated',
                                   (e, data) => syncGlobalSettings(data));
    }
  }

  syncGlobalSettings();

  // If the websocket is dead, we still need to show the page.
  $timeout(function () {
    $rootScope.themeLoaded = true;
  }, 1000);

  var clearSocketOpenedEvent = $rootScope.$on('socket-opened', function () {
    $rootScope.backendAuthenticated = true;
    clearSocketOpenedEvent();
  });

  new Clipboard('.clipboard-button').on('success', function () {
    Notifications.toast({message: 'Text copied to clipboard'});
  });

  if ($window.addEventListener) {
    $window.addEventListener('storage', onStorageChanged, false);
  } else {
    $window.attachEvent('onstorage', onStorageChanged);
  }

  function onStorageChanged(event) {
    if (event.key !== 'tabCommunication') {
      return;
    }

    if (event.newValue === 'closeDialog') {
      $mdDialog.hide();
    }
  }

  // We check if the user allowed us to show notifications
  // If he didn't set the permissions yet, we ask him to do so
  $timeout(function () {
    if (typeof Notification === 'undefined' ||
        Notification.permission !== 'default') {
      return;
    }
    Notifications.toast({
      message: 'You need to allow us to show you browser notifications',
      actionMessage: 'Set permissions',
      action: function () {
        Notifications.notifyBrowser({
          title: 'HTML5 notifications enabled!',
          timeout: 3,
          showAlways: true,
        });
      },
      hideDelay: 0,
    });
  }, 2000);

  Websocket.onJSON('socketInitialized', function () {

  });
}
