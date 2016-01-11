(function () {
  'use strict';

  angular.module('tf2stadium')
    .factory('Notifications', NotificationsFactory);

  /** @ngInject */
  function NotificationsFactory($rootScope, $mdToast, $window, $document, $timeout, $log, ngAudio) {

    var notificationsService = {};

    var toastDefault = {
      templateUrl: 'app/shared/notifications/toast.html',
      message: 'Default',
      actionMessage: 'OK',
      action: function () {},
      controller: 'ToastController',
      controllerAs: 'toast',
      bindToController: true,
      error: false,
      parent: $document[0].querySelector('#toasts'),
      autoWrap: false,
      hideDelay: 5000
    };

    notificationsService.toast = function (options) {
      var toastOptions = angular.extend({}, toastDefault, options);

      $mdToast
        .show(toastOptions)
        .then(function (clicked) {
          if (clicked === 'ok') {
            toastOptions.action();
          }
        });

      notificationsService.titleNotification();
    };

    notificationsService.titleNotification = function () {
      if (!$document[0].hasFocus()) {
        $rootScope.titleNotification = true;
      }

      $window.onfocus = function () {
        $rootScope.titleNotification = false;
      };
    };

    notificationsService.notifyBrowser = function (options) {
      if (!('Notification' in $window)) {
        $log.log('Browser doesn\'t support HTML5 notifications');
        return;
      }

      var Notification = $window.Notification;

      if (($document[0].hasFocus() && !options.showAlways) || Notification.permission === 'denied') {
        return;
      }

      notificationsService.titleNotification();

      Notification.requestPermission(function () {

        if (Notification.permission !== 'granted') {
          return;
        }

        options.title = options.title || 'TF2Stadium';
        options.icon = options.icon || '/assets/img/logo-no-text.png';
        options.tag = options.tag || 'tf2stadium';

        if (options.soundFile) {
          ngAudio.play(options.soundFile).volume = options.soundVolume;
        }

        var html5notification = new Notification(options.title, options);

        if (options.timeout) {
          $timeout(function (){
            html5notification.close();
          }, options.timeout * 1000);
        }

        for (var callback in options.callbacks) {
          html5notification[callback] = options.callbacks[callback];
        }

      });
    };

    return notificationsService;

  }

})();
