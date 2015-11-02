(function() {
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

    var settings = Settings.getSettings(function(response) {
      settings = response;
    });

    function playerPlaysClass(className) {
      return settings[className];
    }

    return function(lobbies) {

      var filteredList = {};

      for (var key in lobbies) {
        var lobby = lobbies[key];
        lobby.region = "eu";

        var slots = angular.isArray(lobby.classes)? lobby.classes : [];
        var availableClasses = slots
              .filter(slotAvailable)
              .map(slotToSlotName)
              .map(slotNameToClassName)
              .filter(truthy);

        if (settings[lobby.region] &&
<<<<<<< HEAD
            settings[lobby.type] &&
            settings[lobby.map.substr(0, lobby.map.indexOf('_'))] &&
            availableClasses.some(playerPlaysClass)

            || (Config.debug && lobby.type === 'Debug')) {
=======
          settings[lobby.type] &&
          settings[lobby.map.substr(0, lobby.map.indexOf('_'))] ||
          (Config.debug && lobby.type === 'Debug')) {
>>>>>>> 9085363ca17429d83dbc672a23bbe7e20023a939
          filteredList[key] = lobby;
        }
      }

      return filteredList;
    };

  }
})();
