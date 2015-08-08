(function() {
  'use strict';
  
  console.log(123);
  
  angular
    .module('tf2stadium')
    .controller('SettingsController', SettingsController);

  /** @ngInject */
  function SettingsController($scope) {
    var vm = this;
    
    vm.userSettings = {
      regions: [
        {name: "Europe", selected: true},
        {name: "North America", selected: false},
        {name: "Asia", selected: true}
      ],
      formats: [
        {name: '6v6', selected: false},
        {name: 'Highlander', selected: true}
      ],
      gamemodes: [
        {name: 'Control Points', selected: false},
        {name: 'Payload', selected: true}
      ],
      mumbleRequiredOnly: true,
      volume: 57
    };
  }
  
})();
