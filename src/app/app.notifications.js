/* @flow */
import * as audio from './audio';

angular
  .module('tf2stadium.services')
  .factory('Notifications', NotificationsFactory);

const requireSound =
        require.context('../assets/sound/', true, /^.*\.(ogg|wav)$/);

// TODO: move to config (putting this off until we do some sort of
// default configurations)
const VOCAL_NOTIFICATIONS = {
  'Default': {
    _default: true,
    path: './default/',
    gameStart: ['start.wav'],
    readyUp: ['readyup.wav'],
    preview: ['readyup.wav'],
  },

  'Muselk': {
    path: './muselk/',
    countdown: ['Countdown01.ogg', 'Countdown02.ogg', 'CountDown03.ogg'],
    gameStart: ['GameStart01.ogg', 'GameStart02.ogg', 'GameStart03.ogg'],
    readyUp: ['ReadyUpA01.ogg','ReadyUpA02.ogg','ReadyUpB01.ogg',
              'ReadyUpB02.ogg','ReadyUpB03.ogg','ReadyUpB04.ogg'],
    resetAddUp: ['ResetAddUp01.ogg','ResetAddUp02.ogg','ResetAddUp03.ogg'],
    notReady: ['NotReady01.ogg', 'NotReady02.ogg'],
    preview: ['PreviewSound01.ogg', 'PreviewSound02.ogg'],
  },

  'Uncle Dane': {
    path: './uncledane/',
    countdown: ['Countdown01.ogg'],
    gameStart: ['GameStart01.ogg'],
    kicked: ['KickedByLeader01.ogg'],
    readyUp: ['ReadyUpA01.ogg', 'ReadyUpB01.ogg'],
    resetAddUp: ['ResetAddUp01.ogg'],
    preview: ['PreviewSound01.ogg'],
  },

  'King Raja': {
    path: './kingraja/',
    countdown: ['Countdown01.ogg'],
    gameStart: ['GameStart01.ogg'],
    kicked: ['KickedByLeader01.ogg'],
    readyUp: ['ReadyUpA01.ogg', 'ReadyUpB01.ogg'],
    notReady: ['NotReady01.ogg'],
    preview: ['PreviewSound01.ogg'],
  },

  'KevinIsPwn': {
    path: './kevinispwn/',
    countdown: ['Countdown01.ogg'],
    gameStart: ['GameStart01.ogg'],
    readyUp: ['ReadyUpA01.ogg', 'ReadyUpB01.ogg'],
    preview: ['PreviewSound01.ogg'],
  },

  'KritzKast': {
    path: './kritzkast/',
    countdown: ['Countdown01.ogg','Countdown02.ogg','Countdown03.ogg'],
    gameStart: ['GameStart01.ogg', 'GameStart02.ogg', 'GameStart03.ogg'],
    readyUp: ['ReadyUpA01.ogg','ReadyUpA02.ogg','ReadyUpA03.ogg',
              'ReadyUpB01.ogg','ReadyUpB02.ogg','ReadyUpB03.ogg'],
    preview: ['PreviewSound.ogg'],
  },

  'Getawhale': {
    path: './getawhale/',
    countdown: ['Countdown01.ogg'],
    gameStart: ['GameStart01.ogg'],
    readyUp: ['ReadyUpA01.ogg', 'ReadyUpB01.ogg'],
    preview: ['PreviewSound01.ogg'],
    notReady: ['NotReady01.ogg'],
    kicked: ['KickedByLeader01.ogg'],
    // LiftedRestrict01.ogg
    // LobbyClosed01.ogg
    // ReserAddup01.ogg
  },

  'GGGLYGY': {
    path: './ggglygy/',
    countdown: ['Countdown01.wav','Countdown02.wav','Countdown03.wav'],
    gameStart: ['GameStart01.wav','GameStart02.wav','GameStart03.wav'],
    readyUp: ['ReadyUpA01.wav','ReadyUpA02.wav','ReadyUpA03.wav',
              'ReadyUpA04.wav','ReadyUpA05.wav','ReadyUpB01.wav',
              'ReadyUpB02.wav','ReadyUpB03.wav'],
    preview: ['PreviewSound01.wav'],
  },
};

angular
  .module('tf2stadium.services')
  .constant('VocalNotifications', VOCAL_NOTIFICATIONS);

/** @ngInject */
export function NotificationsFactory($rootScope: AngularJSScope, $mdToast, $window: typeof window, $document,
                                     $timeout: AngularJSTimeout, $log) {
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

  notificationsService.availableSoundPacks = Object.keys(VOCAL_NOTIFICATIONS);

  notificationsService.getSound = function (event, settings) {
    var soundPackName = settings.soundPack,
      soundPack = VOCAL_NOTIFICATIONS[soundPackName];

    if (soundPack) {
      var sounds = soundPack[event];
      if (sounds) {
        var sound = sounds[Math.floor(Math.random() * sounds.length)];
        return requireSound(soundPack.path + sound);
      }
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

      if (options.callbacks) {
        Object.keys(options.callbacks).forEach((callback) => {
          html5notification[callback] = options.callbacks[callback];
        });
      }
    });
  };

  return notificationsService;
}
