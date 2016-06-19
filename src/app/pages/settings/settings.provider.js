/* @flow */
angular.module('tf2stadium')
  .config(SettingsPageConfig)
  .provider('SettingsPage', SettingsPage);

require('./section-filters.html');
require('./section-chat.html');
require('./section-servers.html');
require('./settings.html');
require('./section-sound.html');
require('./section-general.html');
require('./settings-sidebar.html');
require('./section-theme.html');
require('./section-account.html');

/** @ngInject */
function SettingsPageConfig($stateProvider, SettingsPageProvider) {
  /*
   Makes children states for each section of the settings.
   */
  SettingsPageProvider.sections = [
    'theme',
    'general',
    'chat',
    'filters',
    'sound',
    'servers',
    'account',
  ];

  for (var settingSectionKey of Object.keys(SettingsPageProvider.sections)) {
    var settingSection = SettingsPageProvider.sections[settingSectionKey];
    $stateProvider.state(settingSection, {
      url: '/' + settingSection,
      parent: 'settings',
      views: {
        'setting-section': {
          templateUrl: 'app/pages/settings/section-' + settingSection + '.html',
        },
      },
    });
  }
}

/** @ngInject */
function SettingsPage() {

  var settingsPageProvider = {};

  settingsPageProvider.sections = {};

  /** @ngInject */
  var settingsPageService = function (Settings) {
    settingsPageProvider.sections = {
      theme: {
        theme: Settings.getConstants('themesList'),
        animationOptions: Settings.getConstants('animationOptions'),
        videoBackground: Settings.getConstants('videoBackground'),
      },
      general: {
        autoOpenLogs: Settings.getConstants('autoOpenLogs'),
      },
      chat: {
        emotes: Settings.getConstants('emoteStyle'),
        timestamps: Settings.getConstants('timestampOptions'),
      },
      filters: Settings.getConstants('filters'),
      sound: Settings.getConstants('sound'),
      servers: null,
      account: null,
    };

    settingsPageService.getSections = () => settingsPageProvider.sections;

    return settingsPageService;
  };

  settingsPageProvider.$get = settingsPageService;

  return settingsPageProvider;
}
