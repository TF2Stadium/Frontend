(function () {
  'use strict';

  angular.module('tf2stadium').constant('Config', {
    'endpoints': {
      'websocket': 'ws://api.tf2stadium.gcommer.com/websocket/',
      'api': 'http://api.tf2stadium.gcommer.com'
    },
    'debug': true
  });

})();
