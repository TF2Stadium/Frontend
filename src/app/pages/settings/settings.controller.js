(function() {
  'use strict';
  
  console.log(123);
  
  angular
    .module('tf2stadium')
    .controller('SettingsPageController', SettingsPageController);

  /** @ngInject */
  function SettingsPageController(Settings) {
    var vm = this;
    
    vm.settingsList = Settings.getConstants('settingsList');

    /*
      Iterates through all the settings in the list and compares
      them to the stored settings.

      If a user setting exists for that element, it gets updated.
      If it doesn't, it defaults to true.
    */
    var populateSettings = function() {

      for (var settingsGroupKey in vm.settingsList) {
        var settingsGroup = vm.settingsList[settingsGroupKey];

        for (var fieldKey in settingsGroup) {
          if (userSettings.hasOwnProperty(fieldKey)) {
            //The backend sends a string, so it can't be assigned directly to the value
            settingsGroup[fieldKey].selected = ("true" == userSettings[fieldKey]);
          } else {
            settingsGroup[fieldKey].selected = true;
          }
        }
      }
    }

    var userSettings = {};

    Settings.loadSettings(function(response) {
      userSettings = response.data;
      populateSettings();
    });

    vm.saveSetting = function(key, value) {
      Settings.set(key, value.toString());
    }
  }
  
})();
