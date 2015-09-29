(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyPageController', LobbyPageController)
    .controller('LobbyPageReadyDialog', LobbyPageReadyDialog);

  /** @ngInject */
  function LobbyPageController($scope, LobbyService, Websocket) {
    var vm = this;

    vm.lobbyInformation = LobbyService.getActive();

    LobbyService.subscribeActive($scope, function(){
      vm.lobbyInformation = LobbyService.getActive();
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

    LobbyService.subscribe('lobby-ready-up', $scope, function(){
      vm.inReadyUp = true;      
    });

    LobbyService.subscribe('lobby-start', $scope, function(){
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
