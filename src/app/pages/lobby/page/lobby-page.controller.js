(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyPageController', LobbyPageController)
    .controller('HeaderController', HeaderController)
    .controller('SpectatorsController', SpectatorsController);

  /** @ngInject */
  function LobbyPageController() {
    var vm = this;
    
    vm.lobbyInformation={
        type: 'hl',
        map: 'pl_upward',  
        classes: [
          {classname: 'scout', slots:{
              blu: {name:'Crayboff', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:'1234'},
              red: {name:'Red', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:''}
          }},
          {classname: 'scout', slots:{
              blu: {name:'Blu', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:''},
              red: {name:'Schalla', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:'25'}
          }},
          {classname: 'soldier', slots:{
              blu: {name:'Capu', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:'1234'},
              red: {name:'Other player', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:'234'}
          }},
          {classname: 'soldier', slots:{
              blu: {name:'Masternoob', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:'1234'},
              red: {name:'Red', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:''}
          }},
          {classname: 'demoman', slots:{
              blu: {name:'Blu', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:''},
              red: {name:'Red', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:''}
          }},
          {classname: 'medic', slots:{
              blu: {name:'Gibusvision', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:'1234'},
              red: {name:'Red', hoursPlayed:123, lobbiesPlayed:123, reliability:99, id:''}
          }},
        ],
        currentSlotsTaken: 9,
        region: 'eu',
        mumbleRequired: true,
        rules:'UGC',
        serverLocation: 'Germany',
        spectators: [
          {name:'Spectator 1'},
          {name:'Another spec'}
        ]
    };
  }
  
  /** @ngInject */
  function HeaderController($timeout, Websocket) {
  }
  
  /** @ngInject */
  function SpectatorsController($timeout, Websocket) {
    var vm = this;
    
    vm.spectators = [
        {name: 1},
        {name: 2},
        {name: 3},
        {name: 4}
      ];
  }
  
})();
