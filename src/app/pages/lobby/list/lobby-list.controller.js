(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($timeout, Websocket) {
    var vm = this;
    
    vm.lobbies=[{
      type: 'hl',
      map: 'pl_upward',  
      slots: [
        {class:'scout', blue:true, red:false},
        {class:'soldier', blue:true, red:false},
        {class:'pyro', blue:true, red:true},
        {class:'demoman', blue:false, red:false},
        {class:'heavy', blue:true, red:false},
        {class:'engineer', blue:true, red:true},
        {class:'medic', blue:true, red:true},
        {class:'sniper', blue:true, red:false},
        {class:'spy', blue:false, red:false}
      ],
      currentSlotsTaken: 9,
      region: 'eu',
      mumbleRequired: true,
      rules:'UGC',
      serverLocation: 'Germany'
      },

        {
      type: '6s',
      map: 'cp_process_final',  
      slots: [
        {class:'scout', blue:true, red:true},
        {class:'scout', blue:true, red:true},
        {class:'soldier', blue:true, red:true},
        {class:'soldier', blue:true, red:true},
        {class:'demoman', blue:true, red:true},
        {class:'medic', blue:true, red:true}
      ],
      currentSlotsTaken: 8,
      region: 'eu',
      mumbleRequired: false,
      rules:'ETF2L',
      serverLocation: 'France'
      },

        {
      type: '6s',
      map: 'cp_process_final',  
      slots: [
        {class:'scout', blue:false, red:false},
        {class:'scout', blue:false, red:false},
        {class:'soldier', blue:true, red:false},
        {class:'soldier', blue:false, red:false},
        {class:'demoman', blue:true, red:false},
        {class:'medic', blue:true, red:true}
      ],
      currentSlotsTaken: 8,
      region: 'eu',
      mumbleRequired: false,
      rules:'ETF2L',
      serverLocation: 'France'
      },

        {
      type: '6s',
      map: 'cp_process_final',  
      slots: [
        {class:'scout', blue:false, red:false},
        {class:'scout', blue:false, red:false},
        {class:'soldier', blue:true, red:false},
        {class:'soldier', blue:false, red:false},
        {class:'demoman', blue:true, red:false},
        {class:'medic', blue:true, red:true}
      ],
      currentSlotsTaken: 8,
      region: 'eu',
      mumbleRequired: false,
      rules:'ETF2L',
      serverLocation: 'France'
      }];
  }
})();
