(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('SettingsPageController', SettingsPageController);

  /** @ngInject */
  function SettingsPageController(SettingsPage, Settings) {
    var vm = this;

    vm.sections = SettingsPage.getSections();

    var userSettings = {};

    vm.saveSetting = function(key, value) {
      Settings.set(key, value);
    };

    vm.setCurrent = function(key) {
      vm.current = key;
    }

    /*
      Iterates through all the settings in the list and compares
      them to the stored settings.

      If a user setting exists for that element, it gets updated.
      If it doesn't, it defaults to true.
    */
    var populateFilters = function(userSettings) {
      for (var settingsGroupKey in vm.sections.filters) {
        var settingsGroup = vm.sections.filters[settingsGroupKey];
        for (var fieldKey in settingsGroup) {
          settingsGroup[fieldKey].selected = userSettings[fieldKey];
        }
      }
    };

    Settings.getSettings(function(response) {
      populateFilters(response);
    });

  }

})();
