(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.config(SettingsPageConfig);
  app.provider('SettingsPage', SettingsPage);

  /** @ngInject */
  function SettingsPageConfig($stateProvider, SettingsPageProvider) {
    /*
      Makes children states for each section of the settings.
    */
    SettingsPageProvider.sections = [
      'theme',
      'filters'
    ];

    for (var settingSectionKey in SettingsPageProvider.sections) {
      var settingSection = SettingsPageProvider.sections[settingSectionKey];
      $stateProvider.state(settingSection, {
        url: '/' + settingSection,
        parent: 'settings',
        views: {
          "setting-section": {
            templateUrl: 'app/pages/settings/section-' + settingSection + '.html'
          }
        }
      });
    }
  }  

  /** @ngInject */
  function SettingsPage() {

    var settingsPageProvider = {};

    settingsPageProvider.sections =  [];

    /** @ngInject */
    var settingsPageService = function(Settings) {

      settingsPageProvider.sections.theme = Settings.getConstants('themesList');
      settingsPageProvider.sections.filters = Settings.getConstants('filters');

      settingsPageService.getSections = function() {
        return settingsPageProvider.sections;
      };

      return settingsPageService;
    };

    settingsPageProvider.$get = settingsPageService;

    return settingsPageProvider;
  }

})();