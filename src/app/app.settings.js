(function () {
  'use strict';

  angular.module('tf2stadium')
    .provider('Settings', Settings)
    .config(SettingsConfigBlock);


  /** @ngInject */
  function SettingsConfigBlock(SettingsProvider) {
    SettingsProvider.constants.filters = {
      regions: {
        eu:             {name: 'Europe'},
        na:             {name: 'North America'},
        sa:             {name: 'South America'},
        as:             {name: 'Asia'},
        oc:             {name: 'Oceania'},
        ru:             {name: 'Russia'},
        af:             {name: 'Africa'}
      },
      formats: {
        '6s':           {name: '6s'},
        Highlander:     {name: 'Highlander'},
        '4v4':          {name: '4v4'},
        Bball:          {name: 'Bball'},
        Ultiduo:        {name: 'Ultiduo'}
      },
      gamemodes: {
        cp:             {name: 'Control Points'},
        pl:             {name: 'Payload'},
        koth:           {name: 'King of the hill'},
        otherGamemodes: {name: 'Other gamemodes'}
      },
      classes: {
        scout:          {name: 'Scout' },
        soldier:        {name: 'Soldier' },
        pyro:           {name: 'Pyro' },
        demoman:        {name: 'Demoman' },
        heavy:          {name: 'Heavy' },
        engineer:       {name: 'Engineer' },
        medic:          {name: 'Medic' },
        sniper:         {name: 'Sniper' },
        spy:            {name: 'Spy' }
      },
      misc: {
        mumbleRequired: {name: 'Mumble required'}
      }
    };

    SettingsProvider.constants.themesList = {
      light:    {name: 'TF2Stadium', selector: 'default-theme'},
      dark:     {name: 'TF2Stadium Dark', selector: 'dark-theme'}
    };

    SettingsProvider.constants.videoBackground = {
      on:    {name: 'On',     value: 'on'},
      off:   {name: 'Off',    value: 'off'}
    };

    SettingsProvider.constants.animationOptions = {
      slow:     {name: 'Slow',      selector: 'animation-slow'},
      normal:   {name: 'Normal',    selector: 'animation-normal'},
      fast:     {name: 'Fast',      selector: 'animation-fast'},
      none:     {name: 'None',      selector: 'animation-none'}
    };

    SettingsProvider.constants.timestampOptions = {
      hours12:  {name: '12-hour'},
      hours24:  {name: '24-hour'},
      none:     {name: 'None'}
    };

    SettingsProvider.constants.emoteStyle = {
      emojione: {name: 'EmojiOne'},
      none:     {name: 'None'}
    };

    SettingsProvider.constants.sound = {
      soundVolume: {name: 'Notifications volume'}
    };

    function setDefaultValues() {
      SettingsProvider.settings.currentTheme = 'default-theme';
      SettingsProvider.settings.timestamps = 'hours12';
      SettingsProvider.settings.emoteStyle = 'emojione';
      SettingsProvider.settings.animationLength = 'animation-normal';
      SettingsProvider.settings.savedServers = '{}';
      SettingsProvider.settings.videoBackground = 'on';

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

  function Settings() {
    var settingsProvider = {};

    settingsProvider.settings = {};

    settingsProvider.constants = {};

    /*
      Creates the service with all the functions accessible
      during and after the run phase.
    */
    /** @ngInject */
    var settingsService = function (Websocket, $rootScope, $log, $q) {

      //Private properties
      var settings = settingsProvider.settings;
      var alreadyLoadedFromBackend = false;

      for (var settingKey in localStorage) {
        settings[settingKey] = localStorage.getItem(settingKey);
      }

      $rootScope.$emit('settings-updated');

      Websocket.onJSON('playerSettings', function (data) {
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

        alreadyLoadedFromBackend = true;
        $rootScope.$emit('settings-loaded-from-backend');
        $rootScope.$emit('settings-updated');
      });

      /*
        Saves a setting into the service and into the backend and
        fires an optional callback with the response from the backend as an argument.
      */
      settingsService.set = function (key, newValue, callback, revertOnFail) {
        var oldValue = settings[key];

        if (oldValue === newValue) {
          return $q.when({});
        }

        var deferred = $q.defer();

        callback = callback || angular.noop;
        settings[key] = newValue;

        // TODO: we don't rollback settings changes on commit
        // failures, so it makes sense to always emit this, but that
        // behavior needs to be better thought through: perhaps
        // speculative updates
        $rootScope.$emit('settings-updated');

        localStorage.setItem(key, newValue);

        Websocket.emitJSON('playerSettingsSet',
          //Backend only accepts strings!
          {key: key.toString(), value: newValue.toString()},
          function (response) {
            if (response.success) {
              $log.log('Setting "' + key + '" saved correctly on the backend!');
              deferred.resolve(response);
            } else {
              if (revertOnFail) {
                settings[key] = oldValue;
                $rootScope.$emit('settings-updated');
              }

              $log.log('Error setting key ' + key + ' with value ' +
                       newValue + '. Reason: ' + response.message);
              deferred.reject(response);
            }
            callback(response);
          });

        return deferred.promise;
      };

      settingsService.getConstants = function (key) {
        return settingsProvider.constants[key];
      };

      /*
        Returns all settings and fires an optional callback
        when they are loaded from the backend.
      */
      settingsService.getSettings = function (callback) {
        callback = callback || angular.noop;

        if(!alreadyLoadedFromBackend) {
          var handler = $rootScope.$on('settings-loaded-from-backend', function () {
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
