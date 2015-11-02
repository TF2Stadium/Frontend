(function() {
  'use strict';

  angular
    .module('tf2stadium.services')
    .filter('LobbyListSettingsFilter', LobbyListSettingsFilter);

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

        if (settings[lobby.region] &&
          settings[lobby.type] &&
          settings[lobby.map.substr(0, lobby.map.indexOf('_'))] ||
          (Config.debug && lobby.type === 'Debug')) {
          filteredList[key] = lobby;
        }
      }

      return filteredList;
    };
    
  }
})();
