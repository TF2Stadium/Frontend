(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($scope, Websocket, LobbyService, $state) {
    var vm = this;

    vm.lobbies=LobbyService.getList();

    vm.join = function (lobby, team, position) {
      var lobbyData = {
        'id': lobby,
        'team': team,
        'class': position
      };

      Websocket.emit('lobbyJoin', JSON.stringify(lobbyData), function(data) {
        var response = JSON.parse(data);
        if (response.success === true) {
          $state.go('lobby-page', {'lobbyID': lobby});
        }
      });
    };

    LobbyService.subscribeList($scope, function (){
      vm.lobbies = LobbyService.getList();
    });

  }
})();
