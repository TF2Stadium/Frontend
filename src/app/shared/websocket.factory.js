(function() {
  'use strict';

  angular.module('teamplay.services').factory('Websocket', Websocket);

  /** @ngInject */
  function Websocket(socketFactory)
  {
      return socketFactory({
        prefix: '',
        ioSocket: io.connect('http://localhost:8080')
      });
  }
})();
