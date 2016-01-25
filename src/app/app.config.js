(function () {
  'use strict';

  angular.module('tf2stadium').constant('Config', {
    'endpoints': {
      'websocket': 'ws://localhost:8080/websocket/',
      'api': 'http://localhost:8080'
    },
    'debug': true,
    'allowedChatDomains': [
      'logs.tf',
      'teamfortress.tv',
      'teamfortress.com',
      'steamcommunity.com',
      'steampowered.com',
      'valvesoftware.com',
      'imgur.com',
      'bball.tf',
      'jump.tf',
      'twitch.tv',
      'tf2stadium.com',
      'tragicservers.com',
      'playcomp.tf',
      'etf2l.com',
      'ugcleague.com',
      'esea.com',
      'esea.net',
      'asiafortress.com',
      'ozfortress.com',
      'tf2center.com',
      'tf2lobby.com'
    ]
  });

})();
