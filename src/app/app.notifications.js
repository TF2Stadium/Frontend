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

    vm.remove = function(id) {
      Notifications.remove(id);
    }

    vm.add = function(message, level) {
      Notifications.add(message, level);
    }

    vm.isEmpty = function() {
      return Object.keys(vm.notifications).length < 1;
    }

    vm.notifications = Notifications.getNotifications();

  }

})();