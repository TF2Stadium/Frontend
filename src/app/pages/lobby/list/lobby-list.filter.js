(function() {
  'use strict';

  angular
    .module('tf2stadium.services')
    .filter('LobbyListSettingsFilter', LobbyListSettingsFilter);

  var CLASS_SYNONYMS = {
    roamer: 'soldier',
    pocket: 'soldier',
    scout1: 'scout',
    scout2: 'scout'
  };

  function maybeClassName(slot) {
    if (!(slot.blu.filled && slot.red.filled)) {
      var className = slot.class;
      if (CLASS_SYNONYMS.hasOwnProperty(className)) {
        className = CLASS_SYNONYMS[className];
      }
      return className;
    }
    return false;
  }

  function truthy(x) {
    return !!x;
  }

  /** @ngInject */
  function LobbyListSettingsFilter(Settings, Config) {

    var settings = Settings.getSettings(function(response) {
      settings = response;
    });

    return function(lobbies) {

      var filteredList = {};

      for (var key in lobbies) {
        var lobby = lobbies[key];
        lobby.region = "eu";

        var classes = angular.isArray(lobby.classes)? lobby.classes : [];
        var availableClasses = classes.map(slotNameToClassName).filter(truthy);

        if (settings[lobby.region] &&
            settings[lobby.type] &&
            settings[lobby.map.substr(0, lobby.map.indexOf('_'))] &&
            availableClasses.some(function(className) {
              return settings[className];
            })

            || (Config.debug && lobby.type === 'Debug')) {
          filteredList[key] = lobby;
        }
      }

      return filteredList;
    };

  }
})();
