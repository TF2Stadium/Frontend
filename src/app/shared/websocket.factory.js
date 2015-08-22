/* globals io */
(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('Websocket', Websocket);

  /** @ngInject */
  function Websocket(socketFactory, Config)
  {
      return socketFactory({
        prefix: '',
        ioSocket: io.connect(Config.endpoints.websocket)
      });
  }
})();
