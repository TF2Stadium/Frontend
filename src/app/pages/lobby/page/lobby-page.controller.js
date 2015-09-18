(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyPageController', LobbyPageController);

  /** @ngInject */
  function LobbyPageController($scope, LobbyService, Websocket) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getActive();

    LobbyService.subscribeActive($scope, function(){
      vm.lobbyInformation = LobbyService.getActive();
      console.log(vm.lobbyInformation);
    });

    vm.join = function (lobby, team, position) {
      var lobbyData = {
        'id': lobby,
        'team': team,
        'class': position
      };

      Websocket.emitJSON('lobbyJoin', lobbyData, function(data) {
        //ToDo: Error Handling
        if (data.success !== true) {
        }
      });
    };

    Websocket.onJSON('lobbyReadyUp', function(data) {
      console.log(data);
    });

    Websocket.onJSON('lobbyStart', function(data) {
      console.log(data);
    });

  }


})();
