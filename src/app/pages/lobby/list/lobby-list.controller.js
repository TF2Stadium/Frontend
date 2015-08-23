(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($timeout, Websocket, $state) {
    var vm = this;
    
    vm.lobbies=[];

    vm.join = function (lobby, team, position) {
      var lobbyData = {
        'id': lobby,
        'team': team,
        'class': position
      };

      Websocket.emit('lobbyJoin', JSON.stringify(lobbyData), function(data) {
        var response = JSON.parse(data);
        console.log(response);
        if (response.success === true) {
          $state.go('lobby-page', {'lobbyID': lobby});
        }
      });
    };

    Websocket.on('lobbyListData', function(data) {
      vm.lobbies = JSON.parse(data).lobbies;
      console.log(vm.lobbies[1]);
    });
  }
})();
