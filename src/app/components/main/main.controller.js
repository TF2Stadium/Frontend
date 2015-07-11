(function() {
  'use strict';

  angular
    .module('teamplay')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, Websocket) {
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
})();
