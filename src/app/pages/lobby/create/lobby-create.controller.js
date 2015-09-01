(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyCreateController', LobbyCreateController);

  /** @ngInject */
  function LobbyCreateController($timeout, Websocket) {
    var vm = this;
    
    vm.lobbySettingsList = {
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
      maps: [
        'cp_process',
        'koth_viaduct'
      ]
    };
    
    vm.lobbySettings = {
      server: 'tf2stadium.com:27031',
      rconpwd: '',
      type: 'highlander',
      mapName: 'koth_viaduct',
      whitelist: '3966',
      mumbleRequired: false,
    };

    vm.create = function() {
      Websocket.emit ('lobbyCreate', JSON.stringify(vm.lobbySettings), function(data) {
        var response = JSON.parse(data);
        console.log(response);
      });
    }
  }
})();
