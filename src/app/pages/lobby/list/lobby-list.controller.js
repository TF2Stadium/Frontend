(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController);

  /** @ngInject */
  function LobbyListController($scope, Websocket, LobbyService) {
    var vm = this;

    vm.lobbies=LobbyService.getList();

    vm.join = function (lobby, team, position) {

      Websocket.emitJSON('lobbyJoin',
        {
          'id': lobby,
          'team': team,
          'class': position          
        }
      );

    };

    LobbyService.subscribeList($scope, function (){
      vm.lobbies = LobbyService.getList();
    });

  }
})();
