/* @flow */
import { vocalNotifications } from './app.notifications.js';

angular.module('tf2stadium')
  .provider('Settings', Settings);

function Settings() {
  var settingsProvider = {};

  settingsProvider.settings = {};

  settingsProvider.constants = {
    filters: {
      regions: {
        eu:             {name: 'Europe'},
        na:             {name: 'North America'},
        sa:             {name: 'South America'},
        as:             {name: 'Asia'},
        oc:             {name: 'Oceania'},
        ru:             {name: 'Russia'},
        af:             {name: 'Africa'},
      },
      formats: {
        '6s':           {name: '6s'},
        Highlander:     {name: 'Highlander'},
        '4v4':          {name: '4v4'},
        Bball:          {name: 'Bball'},
        Ultiduo:        {name: 'Ultiduo'},
        Prolander:      {name: 'Prolander'},
      },
      gamemodes: {
        cp:             {name: 'Control Points'},
        pl:             {name: 'Payload'},
        koth:           {name: 'King of the hill'},
        otherGamemodes: {name: 'Other gamemodes'},
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
        spy:            {name: 'Spy' },
      },
      misc: {
        mumbleRequired: {name: 'Mumble required'},
      },
    },

    themesList: {
      light:    {name: 'TF2Stadium', selector: 'default-theme'},
      dark:     {name: 'TF2Stadium Dark', selector: 'dark-theme'},
    },

    videoBackground: {
      on:    {name: 'On',     value: 'on'},
      off:   {name: 'Off',    value: 'off'},
    },

    autoOpenLogs: {
      on:    {name: 'On',     value: 'on'},
      off:   {name: 'Off',    value: 'off'},
    },

    animationOptions: {
      slow:     {name: 'Slow',      selector: 'animation-slow'},
      normal:   {name: 'Normal',    selector: 'animation-normal'},
      fast:     {name: 'Fast',      selector: 'animation-fast'},
      none:     {name: 'None',      selector: 'animation-none'},
    },

    timestampOptions: {
      hours12:  {name: '12-hour'},
      hours24:  {name: '24-hour'},
      none:     {name: 'None'},
    },

    emoteStyle: {
      emojione: {name: 'EmojiOne'},
      none:     {name: 'None'},
    },

    sound: {
      soundVolume: {name: 'Notifications volume'},
    },
  };

  function setDefaultValues() {
    settingsProvider.settings.currentTheme = 'default-theme';
    settingsProvider.settings.timestamps = 'hours12';
    settingsProvider.settings.emoteStyle = 'emojione';
    settingsProvider.settings.animationLength = 'animation-normal';
    settingsProvider.settings.savedServers = '{}';
    settingsProvider.settings.recentConfigurations = '[]';
    settingsProvider.settings.savedConfigurations = '[]';
    settingsProvider.settings.videoBackground = 'on';
    settingsProvider.settings.autoOpenLogs = 'on';

    // Use Array.find(arrVal,..) vs arrValue.find(..) to avoid using a
    // prototype polyfill for now...
    const packs = Object.entries(vocalNotifications),
      defaultMarkedPacks = packs.find(([k, o]) => (o._default ? k : false)),
      defaultSoundPack = defaultMarkedPacks ?
      defaultMarkedPacks[0] : packs[0][1];

    settingsProvider.settings.soundVolume = 10;
    settingsProvider.settings.soundPack = defaultSoundPack;

    /*
      Defaults every value found in the filters to true.
      It gets overwritten with the loaded settings in the SettingsRunBlock
    */
    Object.keys(settingsProvider.constants.filters).forEach(settingsGroupKey => {
      Object.keys(settingsProvider.constants.filters[settingsGroupKey]).forEach(setting => {
        settingsProvider.settings[setting] = true;
      });
    });

    // show all lobbies (even non-Mumble-required) by default
    settingsProvider.settings.mumbleRequired = false;
  }

  setDefaultValues();

  /*
   Creates the service with all the functions accessible
   during and after the run phase.
   */
  /** @ngInject */
  var settingsService = function (Websocket, $rootScope, $log: AngularJSLog, $q) {

    // Private properties
    var settings = settingsProvider.settings;
    var alreadyLoadedFromBackend = false;

    for (var settingKey of Object.keys(localStorage)) {
      settings[settingKey] = localStorage.getItem(settingKey);
    }

    $rootScope.$emit('settings-updated');

    Websocket.onJSON('playerSettings', function (data) {
      for (var setting of Object.keys(data)) {
        var value = data[setting];
        // coerce true/false for conveniece
        if (value === 'true' || value === 'false') {
          value = (value === 'true');
        }

        localStorage.setItem(setting, value.toString());
        settings[setting] = value;
      }

      alreadyLoadedFromBackend = true;
      $rootScope.$emit('settings-loaded-from-backend');
      $rootScope.$emit('settings-updated');
    });

    // Saves a setting into the service and into the backend and fires
    // an optional callback with the response from the backend as an
    // argument.
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
                         // Backend only accepts strings!
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

    settingsService.getConstants = (key) => settingsProvider.constants[key];

    /*
     Returns all settings and fires an optional callback
     when they are loaded from the backend.
     */
    settingsService.getSettings = (callback) => {
      callback = callback || angular.noop;

      if (!alreadyLoadedFromBackend) {
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
