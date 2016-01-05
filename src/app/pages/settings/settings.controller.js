(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('SettingsPageController', SettingsPageController);

  /** @ngInject */
  function SettingsPageController(SettingsPage, Settings, ngAudio, User, Notifications) {
    var vm = this;

    vm.sections = SettingsPage.getSections();

    vm.saveSetting = function (key, value, showNotification) {
      Settings.set(key, value, function () {
        if (showNotification) {
          var msg = 'Setting updated.';
          if (key ===  'siteAlias') {
            msg = 'Alias updated.';
          }

          Notifications.toast({message: msg});
        }
      });
    };

    vm.setCurrent = function (key) {
      vm.current = key;
    };

    vm.playSoundSample = function () {
      Settings.getSettings(function (settings) {
        ngAudio.play('/assets/sound/lobby-readyup.wav').volume = settings.soundVolume / 100;
      });
    };

    vm.logout = function () {
      User.logout();
    };

    /*
      Iterates through all the settings in the list and compares
      them to the stored settings.

      If a user setting exists for that element, it gets updated.
      If it doesn't, it defaults to true.
    */
    var populateFilters = function (userSettings) {
      for (var settingsGroupKey in vm.sections.filters) {
        var settingsGroup = vm.sections.filters[settingsGroupKey];
        for (var fieldKey in settingsGroup) {
          settingsGroup[fieldKey].selected = userSettings[fieldKey];
        }
      }
    };

    Settings.getSettings(function (response) {
      populateFilters(response);
      vm.soundVolume = response.soundVolume;
      vm.siteAlias = response.siteAlias;
    });

  }

})();
