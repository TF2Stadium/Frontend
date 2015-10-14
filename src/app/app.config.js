(function() {
  'use strict';

  angular.module('tf2stadium').constant("Config", {
    'endpoints': {
      'websocket': 'http://localhost:8080',
      'api': 'http://api-dev.tf2stadium.com'
    },
    'debug': true
  });

})();
