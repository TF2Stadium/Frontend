(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.provider('Settings', Settings);
  app.config(SettingsConfigBlock);


  /** @ngInject */
  function SettingsConfigBlock(SettingsProvider) {

    SettingsProvider.constants.settingsList = {
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

    SettingsProvider.constants.themesList = {
      light:  {name: "TF2Stadium", selector: "default-theme"},
      dark:   {name: "TF2Stadium Dark", selector: "dark-theme"}
    };

    function setDefaultValues() {
      SettingsProvider.settings.currentTheme = 'default-theme';

      /*
        Defaults every value found in the settingsList to true.
        It gets overwritten with the loaded settings in the SettingsRunBlock
      */
      for (var settingsGroupKey in SettingsProvider.constants.settingsList) {
        var settingsGroup = SettingsProvider.constants.settingsList[settingsGroupKey];
        for (var setting in settingsGroup) {
          SettingsProvider.settings[setting] = "true";
        }
      }
    }

    setDefaultValues();
  }

  /** @ngInject */
  function Settings() {
    console.log('Starting Settings');

    var settingsProvider = {};

    settingsProvider.settings = {};

    settingsProvider.constants = {};

    /*
      Creates the service with all the functions accessible
      during and after the run phase.
    */
    var settingsService = function(Websocket) {

      //Private properties
      var settings = settingsProvider.settings;
      var alreadyLoadedFromBackend = false;
      var syncWithBackend = function(callback) {
        alreadyLoadedFromBackend = true;
        callback = callback || angular.noop;

        Websocket.emit('playerSettingsGet',
          JSON.stringify({key: ''}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              for (var setting in response.data) {
                var value = response.data[setting];
                /*
                  The backend can only store strings, so we need to convert them
                  to booleans if they are one.
                  It could be an actual string, so we have to check for both true and false.
                */
                if (value === 'true' || value === 'false') {
                  value = (value === 'true');
                }
                localStorage.setItem(setting, value);
                settingsProvider.settings[setting] = value;                
              }
              console.log('Settings loaded correctly! ---> ' + JSON.stringify(settingsProvider.settings));
            } else {
              alreadyLoadedFromBackend = false;
            }
            callback(response);
          }
        );
      }

      /*
        Saves a setting into the service and into the backend and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.set = function(key, value, callback) {

        callback = callback || angular.noop;
        settingsProvider.settings[key] = value;

        Websocket.emit('playerSettingsSet',
          //Backend only accepts strings!
          JSON.stringify({key: key.toString(), value: value.toString()}),
          function(data) {
            var response = JSON.parse(data);
            if (response.success) {
              console.log('Setting "' + key + '" saved correctly on the backend!');
            } else {
              console.log('Error setting key ' + key + ' with value ' + value + '. Reason: ' + response.message);
            }
            callback(response);
          }
        );
      };

      settingsService.get = function(key, callback) {

        callback = callback || angular.noop;

        if (!alreadyLoadedFromBackend) {
          syncWithBackend(function(response) {
            callback(response.data[key]);
          });
        }

        return settingsProvider.settings[key];
      };

      settingsService.getConstants = function(key) {
        return settingsProvider.constants[key];
      };

      /*
        Loads all settings, saves them into the service in case of success and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.getSettings = function(callback) {

        for(var setting in localStorage) {
          settings[setting] = localStorage.getItem(setting);
        }

        if (!alreadyLoadedFromBackend) {
          syncWithBackend (callback);
        }

        return settings;
      };

      return settingsService;
    };


    /*
      Creates the service with all the objects and functions
      accessible ONLY DURING config phase.

      $get returns the service object.
    */
    settingsProvider.$get = settingsService;
    return settingsProvider;
  }

})();
