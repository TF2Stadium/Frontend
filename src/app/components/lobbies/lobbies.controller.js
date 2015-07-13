(function() {
  'use strict';

  angular
    .module('teamplay')
    .controller('LobbiesController', LobbiesController)
    .controller('LobbyController', LobbyController);;

  /** @ngInject */
  function LobbiesController($timeout, Websocket) {
    console.log(Websocket);
    var vm = this;

    vm.messages = [];

    Websocket.on('chatreceive', function(data) {
      vm.messages.push(data);
    });

    vm.sendMessage = function() {
      Websocket.emit('chatpost', vm.chatmessage);
    }
  }

  /** @ngInject */
  function LobbyController($timeout, Websocket) {
    var vm = this;
  }
})();
