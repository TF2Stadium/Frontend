(function() {
  'use strict';

  angular
    .module('tf2stadium')
    .controller('LobbyListController', LobbyListController)
    .controller('LobbyPageController', LobbyPageController);;

  /** @ngInject */
  function LobbyListController($timeout, Websocket) {
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
  function LobbyPageController($timeout, Websocket) {
    var vm = this;
  }
})();
