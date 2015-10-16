(function() {
  'use strict';

  angular
    .module('tf2stadium.services')
    .filter('LobbyListSettingsFilter', LobbyListSettingsFilter);

  /** @ngInject */
  function LobbyListSettingsFilter(Settings) {

    var region = {};
    region['eu']  = Settings.get("regionEU",  function(data) { region['eu']  = data });
    region['na']  = Settings.get("regionNA",  function(data) { region['na']  = data });
    region['sa']  = Settings.get("regionSA",  function(data) { region['sa']  = data });
    region['as']  = Settings.get("regionAS",  function(data) { region['as']  = data });
    region['aus'] = Settings.get("regionAUS", function(data) { region['aus'] = data });
    region['ru']  = Settings.get("regionRU",  function(data) { region['ru']  = data });
    region['af']  = Settings.get("regionAF",  function(data) { region['af']  = data });

    var format = {};
    format['Sixes'] = Settings.get("formatSIXES", function(data) { format['sixes'] = data });
    format['Highlander'] = Settings.get("formatHL", function(data) { format['highlander'] = data });

    var gamemode = {};
    gamemode['cp'] = Settings.get("gamemodeCP", function(data) { gamemode['cp'] = data });
    gamemode['pl'] = Settings.get("gamemodePL", function(data) { gamemode['pl'] = data });
    gamemode['koth'] = Settings.get("gamemodeKOTH", function(data) { gamemode['koth'] = data });
    gamemode['other'] = Settings.get("gamemodeOTHERS", function(data) { gamemode['other'] = data });

    function filterRegion(input) {
      return region[input];
    }

    function filterFormat(input) {
      if (format[input] === undefined) {
        return true;
      } else {
        //ToDo: Replace those strings with booleans, report to backend.
        return (format[input]==="true");
      }
    }

    function filterGamemode(input) {
      return true;
    }

    return function(lobbies) {

      var lobby;
      var filtered = {};

      for (var key in lobbies) {
        lobby = lobbies[key];
        lobby.region = "eu";

        var resultRegion = filterRegion(lobby.region);
        var resultFormat = filterFormat(lobby.type);
        var resultGamemode = filterGamemode(lobby.map);

        if (resultRegion && resultFormat && resultGamemode){
          filtered[key] = lobby;
        }
      }

      return filtered;
    };
  }
})();
