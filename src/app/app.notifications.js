import * as audio from './audio';

angular
  .module('tf2stadium.services')
  .factory('Notifications', NotificationsFactory);

/** @ngInject */
export function NotificationsFactory($rootScope, $mdToast, $window, $document,
                                     $timeout, $log) {
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

  $rootScope.titleNotification = false;

  $window.onfocus = function () {
    $rootScope.titleNotification = false;
  };

  notificationsService.titleNotification = function () {
    if (!$document[0].hasFocus()) {
      $rootScope.titleNotification = true;
    }
  };

  notificationsService.notifyBrowser = function (options) {
    if (options.soundFile) {
      audio.play(options.soundFile, options.soundVolume);
    }

    notificationsService.titleNotification();

    if (!('Notification' in $window)) {
      $log.log('Browser doesn\'t support HTML5 notifications');
      return;
    }

    var Notification = $window.Notification;

    if (($document[0].hasFocus() && !options.showAlways)
        || Notification.permission === 'denied') {
      return;
    }

    Notification.requestPermission(function () {
      if (Notification.permission !== 'granted') {
        return;
      }

      options.title = options.title || 'TF2Stadium';
      options.icon = options.icon || '/assets/img/logo-no-text.png';
      options.tag = options.tag || 'tf2stadium';

      var html5notification = new Notification(options.title, options);

      if (options.timeout) {
        $timeout(() => html5notification.close(),
                 options.timeout * 1000);
      }

      for (var callback in options.callbacks) {
        html5notification[callback] = options.callbacks[callback];
      }
    });
  };

  return notificationsService;
}
