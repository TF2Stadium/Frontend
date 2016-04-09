import * as audio from './audio';

angular
  .module('tf2stadium.services')
  .factory('Notifications', NotificationsFactory);

/** @ngInject */
export function NotificationsFactory($rootScope, $mdToast, $window, $document,
                                     $timeout, $log) {
  var vocalNotifications = {
    "Muselk": {
      path: "/assets/sound/muselk/",
      countdown: ["Countdown01.ogg", "Countdown02.ogg", "CountDown03.ogg"],
      gameStart: ["GameStart01.ogg", "GameStart02.ogg", "GameStart03.ogg"],
      readyUp: ["ReadyUpA01.ogg","ReadyUpA02.ogg","ReadyUpB01.ogg","ReadyUpB02.ogg","ReadyUpB03.ogg","ReadyUpB04.ogg"],
      resetAddUp: ["ResetAddUp01.ogg","ResetAddUp02.ogg","ResetAddUp03.ogg"],
      notReady: ["NotReady01.ogg", "NotReady02.ogg"],
      preview: ["PreviewSound01.ogg", "PreviewSound02.ogg"],
    },

    "Uncle Dane": {
      path: "/assets/sound/uncledane/",
      countdown: ["Countdown01.ogg"],
      gameStart: ["GameStart01.ogg"],
      kicked: ["KickedByLeader01.ogg"],
      readyUp: ["ReadyUpA01.ogg", "ReadyUpB01.ogg"],
      resetAddUp: ["ResetAddUp01.ogg"],
      preview: ["PreviewSound01.ogg"]
    },

    "King Raja": {
      path: "/assets/sound/kingraja/",
      countdown: ["Countdown01.ogg"],
      gameStart: ["GameStart01.ogg"],
      kicked: ["KickedByLeader01.ogg"],
      readyUp: ["ReadyUpA01.ogg", "ReadyUpB01.ogg"],
      notReady: ["NotReady01.ogg"],
      preview: ["PreviewSound01.ogg"]
    },

    "KevinIsPwn": {
      path: "/assets/sound/kevinispwn/",
      countdown: ["Countdown01.ogg"],
      gameStart: ["GameStart01.ogg"],
      readyUp: ["ReadyUpA01.ogg", "ReadyUpB01.ogg"],
      preview: ["PreviewSound01.ogg"]
    },

    "KritzKast": {
      path: "/assets/sound/kritzkast/",
      countdown: ["Countdown01.ogg","Countdown02.ogg","Countdown03.ogg"],
      gameStart: ["GameStart01.ogg", "GameStart02.ogg", "GameStart03.ogg"],
      readyUp: ["ReadyUpA01.ogg","ReadyUpA02.ogg","ReadyUpA03.ogg","ReadyUpB01.ogg","ReadyUpB02.ogg","ReadyUpB03.ogg"],
      preview: ["PreviewSound.ogg"],
    }
  }

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
    hideDelay: 5000,
  };

  notificationsService.getSound = function(event, settings) {
    var soundPack = settings["soundPack"];
    if (soundPack && vocalNotifications[soundPack][event]) {
      var sounds = vocalNotifications[soundPack][event];
      return vocalNotifications[soundPack].path + sounds[Math.floor(Math.random() * sounds.length)]
    } else if (event == "readyUp") {
      return "/assets/sound/default/readyup.wav"
    } else if (event == "gameStart") {
      return "/assets/sound/default/start.wav"
    }

    return;
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
