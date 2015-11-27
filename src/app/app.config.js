(function () {
  'use strict';

  angular.module('tf2stadium').constant('Config', {
    'endpoints': {
      'websocket': 'ws://localhost:8080/websocket/',
      'api': 'http://localhost:8080'
    },
    'debug': true
  });

})();
