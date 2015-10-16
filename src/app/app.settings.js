(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.provider('Settings', Settings);
  app.config(SettingsConfigBlock);


  /** @ngInject */
  function SettingsConfigBlock(SettingsProvider) {

    SettingsProvider.constants.filters = {
      regions: {
        regionEU:             {name: 'Europe'},
        regionNA:             {name: 'North America'},
        regionSA:             {name: 'South America'},
        regionAS:             {name: 'Asia'},
        regionAUS:            {name: 'Australia'},
        regionRU:             {name: 'Russia'},
        regionAF:             {name: 'Africa'}
      },
      formats: {
        formatSIXES:          {name: '6v6'},
        formatHL:             {name: 'Highlander'}
      },
      gamemodes: {
        gamemodeCP:           {name: 'Control Points'},
        gamemodePL:           {name: 'Payload'},
        gamemodeKOTH:         {name: 'King of the hill'},
        gamemodeOTHERS:       {name: 'Other gamemodes'},
      }
    };

    SettingsProvider.constants.themesList = {
      light:  {name: "TF2Stadium", selector: "default-theme"},
      dark:   {name: "TF2Stadium Dark", selector: "dark-theme"}
    };

    function setDefaultValues() {
      SettingsProvider.settings.currentTheme = 'default-theme';

      /*
        Defaults every value found in the filters to true.
        It gets overwritten with the loaded settings in the SettingsRunBlock
      */
      for (var settingsGroupKey in SettingsProvider.constants.filters) {
        var settingsGroup = SettingsProvider.constants.filters[settingsGroupKey];
        for (var setting in settingsGroup) {
          SettingsProvider.settings[setting] = true;
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
    /** @ngInject */
    var settingsService = function(Websocket, $rootScope) {

      //Private properties
      var settings = settingsProvider.settings;
      var alreadyLoadedFromBackend = false;

      for(var setting in localStorage) {
        settings[setting] = localStorage.getItem(setting);
      }

      Websocket.onJSON('playerSettings', function(data) {
        for (var setting in data) {
          var value = data[setting];
          /*
            The backend can only store strings, so we need to convert them
            to booleans if they are one.
            It could be an actual string, so we have to check for both true and false.
          */
          if (value === 'true' || value === 'false') {
            value = (value === 'true');
          }
          localStorage.setItem(setting, value);
          settings[setting] = value;
        }

        alreadyLoadedFromBackend = false;
        $rootScope.$emit('settings-loaded-from-backend');
      });

      /*
        Saves a setting into the service and into the backend and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.set = function(key, value, callback) {

        callback = callback || angular.noop;
        settings[key] = value;

        localStorage.setItem(key, value);

        Websocket.emitJSON('playerSettingsSet',
          //Backend only accepts strings!
          {key: key.toString(), value: value.toString()},
          function(response) {
            if (response.success) {
              console.log('Setting "' + key + '" saved correctly on the backend!');
            } else {
              console.log('Error setting key ' + key + ' with value ' + value + '. Reason: ' + response.message);
            }
            callback(response);
          }
        );
      };

      settingsService.getConstants = function(key) {
        return settingsProvider.constants[key];
      };

      /*
        Returns all settings and fires an optional callback
        when they are loaded from the backend.
      */
      settingsService.getSettings = function(callback) {
        callback = callback || angular.noop;

        if(!alreadyLoadedFromBackend) {          
          var handler = $rootScope.$on('settings-loaded-from-backend', function() {
            callback(settings);
            handler();
          });
        } else {
          callback(settings);
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