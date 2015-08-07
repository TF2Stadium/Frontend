(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($timeout, Websocket) {
    var vm = this;
    
    vm.lobbies=[];

    Websocket.on('lobbyListData', function(data) {
      vm.lobbies = JSON.parse(data).lobbies;
      console.log(vm.lobbies);
    });
  }

  /** @ngInject */
  function LobbyPageController($timeout, Websocket) {
    var vm = this;
  }
})();
