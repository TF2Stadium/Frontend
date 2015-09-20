(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('SettingsPageController', SettingsPageController);

  /** @ngInject */
  function SettingsPageController(Settings) {
    var vm = this;

    vm.themesList = Settings.getConstants('themesList');
    vm.filters = Settings.getConstants('filters');

    vm.saveSetting = function(key, value) {
      Settings.set(key, value);
    };

    /*
      Iterates through all the settings in the list and compares
      them to the stored settings.

      If a user setting exists for that element, it gets updated.
      If it doesn't, it defaults to true.
    */
    var populateSettings = function(userSettings) {
      for (var settingsGroupKey in vm.filters) {
        var settingsGroup = vm.filters[settingsGroupKey];
        for (var fieldKey in settingsGroup) {
          settingsGroup[fieldKey].selected = userSettings[fieldKey];
        }
      }
    };

    var userSettings = Settings.getSettings(function(response) {
      populateSettings(response);
    });
    populateSettings(userSettings);
  }

})();
