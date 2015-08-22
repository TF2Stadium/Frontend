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

        if (response.success === true) {
          console.log(response);
          $state.go('lobby-page', {'lobbyID': lobby});
        }
      });
    };
    var secondrun = 4;
    Websocket.on('lobbyListData', function(data) {
      if(secondrun==4) {
        vm.lobbies = JSON.parse(data).lobbies;
        console.log(vm.lobbies);
      } else if(secondrun==0) {
        vm.lobbies[1].classes[2].blu.steamid="sadasdsa";
      }
      secondrun = secondrun-1;
    });
  }
})();
