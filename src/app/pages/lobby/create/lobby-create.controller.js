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
        'Highlander'
      ],
      rulesets: [
        'UGC',
        'ETF2L'
      ],
      maps: [
        'cp_process',
        'koth_viaduct'
      ]
    };
    
    vm.lobbySettings = {
      server: '',
      rconPassword: '',
      region: '',
      format: '',
      map: '',
      ruleset: '',
      mumbleRequired: '',
    };
  }
})();
