(function() {
  'use strict';

  angular
  .module('tf2stadium')
  .provider('Settings', Settings)
  .config(SettingsConfigBlock)
  .run(SettingsRunBlock);

  /** @ngInject */
  function SettingsConfigBlock(SettingsProvider) {
    SettingsProvider.settings["test"] = "config";
  }

  /** @ngInject */
  function SettingsRunBlock(Websocket, Settings) {
    console.log('Setting test after config: ' + Settings.get("test"));
    Settings.set("test", "runBlock");
    console.log('Setting test after runblock: ' + Settings.get("test"));
    Settings.loadSettings();
  }

  /** @ngInject */
  function Settings() {
    console.log('Starting Settings');

    var settings = {"test": "init"};
    console.log('Setting test initialized: ' + settings['test']);

    var settingsService = function(Websocket) {

      settingsService.set = function(key, value) {

        settings[key] = value;

        Websocket.emit('playerSettingsSet',
          JSON.stringify({key: key, value: value}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              console.log('Setting "' + key + '" saved correctly on the backend!');
            }
          }
        );
      }

      settingsService.get = function(key) {
        return settings[key];
      }

      settingsService.loadSettings = function() {
        Websocket.emit('playerSettingsGet',
          JSON.stringify({key: ''}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              settings = response.data;
              console.log('Settings loaded correctly! ---> ' + JSON.stringify(response.data));
            }
          }
        );
      }

      return settingsService;
    };

    var settingsProvider = {
      settings: settings,
      $get: settingsService
    }

    return settingsProvider;
  }

})();
