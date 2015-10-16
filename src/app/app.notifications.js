(function() {
  'use strict';


  var app = angular.module('tf2stadium');
  app.factory('Notifications', Notifications);
  app.controller('NotificationsController', NotificationsController);

  /** @ngInject */
  function Notifications($mdToast, $document, $timeout) {

    var notificationsService = {};

    var notifications = {};
    var id = 0;

    var toastDefault = {
      templateUrl: 'app/shared/notifications/toast.html',
      message: 'Default',
      controller: 'ToastController',
      controllerAs: 'toast',
      bindToController: true,
      error: false,
      parent: $document[0].querySelector('#toasts'),
      hideDelay: 3000
    };

    notificationsService.add = function(message, level) {
      notifications[id] = {message: message, level: level};
      id++;
    };

    notificationsService.remove = function(id) {
      delete notifications[id];
    };

    notificationsService.clearNotifications = function() {
      for (var notificationKey in notifications) {
        delete notifications[notificationKey];
      }
    };

    notificationsService.getNotifications = function() {
      return notifications;
    };

    notificationsService.toast = function(options) {
      for (var key in toastDefault) {
        if (!options[key]) {
          options[key] = toastDefault[key];
        }
      }
      $mdToast.show(options);
    };

    notificationsService.notifyBrowser = function(options) {

      if (!("Notification" in window)) {
        console.log("Browser doesn't support HTML5 notifications");
        return;
      }

      if (document.hasFocus() || Notification.permission === 'denied') {
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
          $timeout(function(){
            html5notification.close();
          }, options.timeout * 1000);
        }

        var notificationCallback = function(callback) {
          options.callbacks[callback]();
        };

        for (var callback in options.callbacks) {
          html5notification[callback] = notificationCallback(callback);
        }

      });
    };

    return notificationsService;

  }

  /** @ngInject */
  function NotificationsController(Notifications) {

    var vm = this;

    vm.remove = function(id) {
      Notifications.remove(id);
    };

    vm.add = function(message, level) {
      Notifications.add(message, level);
    };

    vm.isEmpty = function() {
      return Object.keys(vm.notifications).length < 1;
    };

    vm.notifications = Notifications.getNotifications();

  }

})();
