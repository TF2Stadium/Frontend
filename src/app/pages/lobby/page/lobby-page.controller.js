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

      Websocket.emit('lobbyJoin', JSON.stringify(lobbyData), function(data) {
        var response = JSON.parse(data);
        //ToDo: Error Handling
        if (response.success !== true) {
        }
      });
    };

    Websocket.on('lobbyReadyUp', function(data) {
      console.log(data);
    });

    Websocket.on('lobbyStart', function(data) {
      console.log(data);
    });

  }


})();
