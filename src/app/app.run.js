(function () {
  'use strict';

  angular.module('tf2stadium')
    .config(configBlock)
    .run(runBlock)
    .factory('safeApply', safeApply);

  /** @ngInject */
  function safeApply($rootScope) {
    return function ($scope, fn) {
      /*eslint-disable angular/no-private-call */
      // I know that using $$phase like this is nasty and can lead to
      // bad code in general, but it significantly simplifies
      // integration with Kefir because we no longer have to know if
      // an observable was updated during an angular digest cycle or
      // not
      var phase = $rootScope.$$phase;

      if(phase === '$apply' || phase === '$digest') {
        if (fn) {
          $scope.$eval(fn);
        }
      } else {
        if (fn) {
          $scope.$apply(fn);
        } else {
          $scope.$apply();
        }
      }
    };
  }

  /** @ngInject */
  function configBlock($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|steam|mumble):/);
  }

  /** @ngInject */
  function runBlock($timeout, $window, $state, $rootScope, $log,
                    $mdDialog, Websocket, PreloadService, Config,
                    User, Settings, LobbyService, Notifications) {
    $log.debug('runBlock end');

    /*eslint-disable angular/on-watch */
    /* the angular/on-watch warning doesn't apply to run blocks */
    $rootScope.$on('$stateChangeStart',
      function (event, toState, toParams, fromState) {
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
    Settings.getSettings(function (settings) {
      $rootScope.currentTheme = settings.currentTheme;
      $rootScope.currentTimestampsOption = settings.timestamps;
      $rootScope.animationLength = settings.animationLength;
      $rootScope.themeLoaded = true;
    });

    //If the websocket is dead, we still need to show the page.
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

    //We check if the user allowed us to show notifications
    //If he didn't set the permissions yet, we ask him to do so
    $timeout(function () {
      if (Notification.permission !== 'default') {
        return;
      }
      Notifications.toast({
        message: 'You need to allow us to show you browser notifications',
        actionMessage: 'Set permissions',
        action: function () {
          Notifications.notifyBrowser({
            title: 'HTML5 notifications enabled!',
            timeout: 3,
            showAlways: true
          });
        },
        hideDelay: 0
      });
    }, 2000);

    Websocket.onJSON('socketInitialized', function () {
      $timeout(function () {
        PreloadService.queuePreloadAudio('/assets/sound/lobby-start.wav');
        PreloadService.queuePreloadAudio('/assets/sound/lobby-readyup.wav');
      }, 1000);
    });
  }

})();
