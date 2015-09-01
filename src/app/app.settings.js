(function() {
  'use strict';

  angular
  .module('tf2stadium')
  .provider('Settings', Settings)
  .config(SettingsConfigBlock)
  .run(SettingsRunBlock);

  //Executed at config phase
  /** @ngInject */
  function SettingsConfigBlock(SettingsProvider) {
    SettingsProvider.settings["test"] = "config";
  }

  //Executed at run phase
  /** @ngInject */
  function SettingsRunBlock(Websocket, Settings) {
    console.log('Setting test after config: ' + Settings.get("test"));
    Settings.set("test", "runBlock", function() {
      console.log('Callback from set!');
    });
    console.log('Setting test after runblock: ' + Settings.get("test"));
    Settings.loadSettings(function() {
      console.log('Callback from loadSettings!');
    });
  }

  //Provider configuration
  /** @ngInject */
  function Settings() {
    console.log('Starting Settings');

    var settings = {"test": "init"};
    console.log('Setting test initialized: ' + settings['test']);

    var constants = {};

    constants.settingsList = {
      regions: {
        eu:             {id: 'eu',         name: 'Europe'},
        na:             {id: 'na',         name: 'NorthAmerica'},
        as:             {id: 'as',         name: 'Asia'},
        aus:            {id: 'aus',        name: 'Australia'}
      },
      formats: {
        sixes:          {id: 'sixes',      name: '6v6'},
        highlander:     {id: 'highlander', name: 'Highlander'}
      },
      gamemodes: {
        cp:             {id: 'cp',         name: 'Control Points'},
        pl:             {id: 'pl',         name: 'Payload'}
      },
      mumble: {
        mumble:         {id: 'mumble',     name: 'Mumble'}
      }
    };

    constants.themesList = {
      light:  {name: "TF2Stadium", selector: "default-theme", id: "0"},
      dark:   {name: "TF2Stadium Dark", selector: "dark-theme", id: "1"}
    }

    /*
      Creates the service with all the functions accessible
      during and after the run phase.
    */
    var settingsService = function(Websocket) {

      /*
        Saves a setting into the service and into the backend and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.set = function(key, value, callback) {

        callback = callback || angular.noop;
        settings[key] = value;

        Websocket.emit('playerSettingsSet',
          JSON.stringify({key: key, value: value}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              console.log('Setting "' + key + '" saved correctly on the backend!');
            }
            callback(response);
          }
        );
      }

      settingsService.get = function(key, callback) {

        callback = callback || angular.noop;
        callback(settings[key]);

        return settings[key];
      }

      settingsService.getConstants = function(key) {
        console.log (constants)
        return constants[key];
      }

      /*
        Loads all settings, saves them into the service in case of success and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.loadSettings = function(callback) {

        callback = callback || angular.noop;

        Websocket.emit('playerSettingsGet',
          JSON.stringify({key: ''}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              settings = response.data;
              console.log('Settings loaded correctly! ---> ' + JSON.stringify(response.data));
            }
            callback(response);
          }
        );
      }

      return settingsService;
    };

    /*
      Creates the service with all the objects and functions
      accessible ONLY DURING config phase.

      $get returns the service object.
    */

    var settingsProvider = {
      settings: settings,
      $get: settingsService
    }

    return settingsProvider;
  }

})();