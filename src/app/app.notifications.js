(function () {
  'use strict';

  angular.module('tf2stadium')
    .factory('Notifications', NotificationsFactory)
    .controller('NotificationsController', NotificationsController);

  /** @ngInject */
  function NotificationsFactory($mdToast, $document, $timeout, $log) {

    var notificationsService = {};

    var notifications = {};
    var nextId = 0;

    var toastDefault = {
      templateUrl: 'app/shared/notifications/toast.html',
      message: 'Default',
      actionMessage: 'OK',
      action: function () {
        $mdToast.hide();
      },
      controller: 'ToastController',
      controllerAs: 'toast',
      bindToController: true,
      error: false,
      parent: $document[0].querySelector('#toasts'),
      hideDelay: 0
    };

    notificationsService.add = function (message, level) {
      notifications[nextId] = {message: message, level: level};
      nextId++;
    };

    notificationsService.remove = function (id) {
      delete notifications[id];
    };

    notificationsService.clearNotifications = function () {
      for (var notificationKey in notifications) {
        delete notifications[notificationKey];
      }
    };

    notificationsService.getNotifications = function () {
      return notifications;
    };

    notificationsService.toast = function (options) {
      for (var key in toastDefault) {
        if (!options[key]) {
          options[key] = toastDefault[key];
        }
      }
      $mdToast.show(options);
    };

    notificationsService.notifyBrowser = function (options) {

      if (!('Notification' in window)) {
        $log.log('Browser doesn\'t support HTML5 notifications');
        return;
      }

      if (($document[0].hasFocus() && !options.showAlways) || Notification.permission === 'denied') {
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

  /** @ngInject */
  function NotificationsController(Notifications) {

    var vm = this;

    vm.remove = function (id) {
      Notifications.remove(id);
    };

    vm.add = function (message, level) {
      Notifications.add(message, level);
    };

    vm.isEmpty = function () {
      return Object.keys(vm.notifications).length < 1;
    };

    vm.notifications = Notifications.getNotifications();

  }

})();
