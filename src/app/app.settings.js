(function() {
  'use strict';

  angular.module('tf2stadium').factory('SettingsService', SettingsService);

  /** @ngInject */
  function SettingsService(Websocket) {

    console.log('Starting SettingsService');
    var settingsService = {};

    settingsService.save = function() {

    }

    settingsService.load = function() {

    }

    return settingsService;

  }

})();
