(function() {
  'use strict';


  var app = angular.module('tf2stadium');
  app.factory('Notifications', Notifications);
  app.controller('NotificationsController', NotificationsController);

  /** @ngInject */
  function Notifications() {

    var notificationsService = {};

    var notifications = {};
    var id = 0;

    notificationsService.add = function(message, level) {
      notifications[id] = {message: message, level: level};
      id++;
    }

    notificationsService.remove = function(id) {
      delete notifications[id];
    }

    notificationsService.clearNotifications = function() {
      for (var notificationKey in notifications) {
        delete notifications[notificationKey];
      }
    }

    notificationsService.getNotifications = function() {
      return notifications;
    }

    return notificationsService;

  }

  /** @ngInject */
  function NotificationsController(Notifications) {

    var vm = this;

    /*
      Since ngClass can't execute functions, we need to
      have a count property to check if it's empty.
    */
    var updateCount = function() {
      vm.count = Object.keys(vm.notifications).length;
    }

    vm.remove = function(id) {
      Notifications.remove(id);
      updateCount();
    }

    vm.add = function(message, level) {
      Notifications.add(message, level);
      updateCount();
    }

    vm.notifications = Notifications.getNotifications();
    updateCount();

  }

})();