(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyPageController', LobbyPageController)
    .controller('LobbyPageReadyDialog', LobbyPageReadyDialog);

  /** @ngInject */
  function LobbyPageController($scope, LobbyService, Websocket, $mdDialog) {
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
      $mdDialog.show({
        templateUrl: 'lobbypage-readyup.html.tpl',
        controller: 'LobbyPageReadyDialog',
        controllerAs: 'dialog'
      })
      .then(function(response) {
        if (response === "ready") {
          Websocket.emit("playerReady");
        } else {
          var payload = {
            "id": vm.lobbyInformation.id
          };
          Websocket.emitJSON("lobbyKick", payload);
        }
      });
    });

    Websocket.onJSON('lobbyStart', function(data) {
      console.log(data);
      alert("STARTED");
    });

  }

  function LobbyPageReadyDialog($mdDialog, $timeout) {
    var vm = this;

    vm.seconds = 0;
    vm.limit = 30;

    vm.increaseCounter = function(){
      vm.seconds++;
      timer = $timeout(vm.increaseCounter,1000);

      if (vm.seconds > vm.limit) {
        $mdDialog.hide('leave');
      }
    };

    var timer = $timeout(vm.increaseCounter,1000);

    vm.ready = function () {
      $mdDialog.hide('ready');
    };

    vm.leave = function () {
      $mdDialog.hide('leave');
    };

  }


})();
