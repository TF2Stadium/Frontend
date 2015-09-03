(function() {
  'use strict';

  angular
  .module('tf2stadium')
  .factory('LobbyCreateService', LobbyCreateService)
  .controller('LobbyCreateController', LobbyCreateController);


  /** @ngInject */
  function LobbyCreateService($timeout, Websocket) {

    var lobbyCreateService = {};

    var lobbySettingsList = {
      regions: [
        "Europe",
        "North America",
        "Asia"
      ],
      formats: [
        '6v6',
        'highlander'
      ],
      rulesets: [
        'UGC',
        'ETF2L',
        3966
      ],
      leagues: [
        'UGC',
        'ETF2L'
      ],
      maps: [
        'cp_process',
        'koth_viaduct'
      ]
    }

    lobbyCreateService.create = function(lobbySettings) {
      console.log(lobbySettings)
      Websocket.emit('lobbyCreate',
        JSON.stringify(lobbySettings),
        function(data) {
          var response = JSON.parse(data);
          console.log(response);
        }
      );
    }

    lobbyCreateService.getSettingsList = function() {
      return lobbySettingsList;
    }

    return lobbyCreateService;
  }

  /** @ngInject */
  function LobbyCreateController(LobbyCreateService) {

    var vm = this;

    vm.lobbySettingsList = LobbyCreateService.getSettingsList();

    vm.lobbySettings = {
      server: 'tf2stadium.com:27031',
      rconpwd: '',
      type: 'highlander',
      mapName: 'koth_viaduct',
      whitelist: '3966',
      mumbleRequired: false,
      league: 'etf2l'
    };

    vm.create = function() {
      LobbyCreateService.create(vm.lobbySettings);
    };
  }
})();
