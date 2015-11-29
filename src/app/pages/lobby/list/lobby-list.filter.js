(function () {
  'use strict';

  angular
    .module('tf2stadium.services')
    .filter('LobbyListSettingsFilter', LobbyListSettingsFilter);

  function slotAvailable(slot) {
    return !(slot.blu.filled && slot.red.filled);
  }

  function slotToSlotName(slot) {
    return slot.class;
  }

  function truthy(x) {
    return !!x;
  }

  /** @ngInject */
  function LobbyListSettingsFilter(Settings, Config, $filter) {

    var slotNameToClassName = $filter('slotNameToClassName');

    var settings = Settings.getSettings(function (response) {
      settings = response;
    });

    function playerPlaysClass(className) {
      return settings[className];
    }

    function playerPlaysGamemode(mapName) {
      var gamemode = mapName.split('_')[0];
      if (settings.hasOwnProperty(gamemode)) {
        return settings[gamemode];
      } else {
        return settings.otherGamemodes;
      }
    }

    function playerWantsMumble(lobby) {
      return !(settings.mumbleRequired && !lobby.mumbleRequired);
    }

    return function (lobbies) {

      var filteredList = [];

      for (var key in lobbies) {
        var lobby = lobbies[key];

        var slots = angular.isArray(lobby.classes)? lobby.classes : [];
        var availableClasses = slots
              .filter(slotAvailable)
              .map(slotToSlotName)
              .map(slotNameToClassName)
              .filter(truthy);

        if (settings[lobby.region.code] &&
            settings[lobby.type] &&
            playerPlaysGamemode(lobby.map) &&
            playerWantsMumble(lobby) &&
            availableClasses.some(playerPlaysClass)

            || !settings['filtersEnabled']
            || (Config.debug && lobby.type === 'Debug')) {
          filteredList.push(lobby);
        }
      }

      return filteredList;
    };

  }
})();
