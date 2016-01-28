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
      if (!lobbies) {
        return [];
      }

      if (!settings['filtersEnabled']) {
        return lobbies;
      }

      return lobbies.filter(function (lobby) {
        var availableClasses = [];

        if (angular.isArray(lobby.classes)) {
          availableClasses = lobby.classes
            .filter(slotAvailable)
            .map(slotToSlotName)
            .map(slotNameToClassName)
            .filter(truthy);
        }

        // If this is a sub data it'll have only a .class attribute,
        // no .classes list
        if (lobby.class) {
          availableClasses = [lobby.class];
        }

        var regionCode = lobby.region.code;

        // Allow an empty region code, so filtering doesn't totally
        // break if the backend doesn't have GeoIP configured.
        var regionOk = regionCode === '' || settings[regionCode];

        return regionOk &&
          settings[lobby.type] &&
          playerPlaysGamemode(lobby.map) &&
          playerWantsMumble(lobby) &&
          availableClasses.some(playerPlaysClass) ||
          (Config.debug && lobby.type === 'Debug');
      });
    };
  }


})();
