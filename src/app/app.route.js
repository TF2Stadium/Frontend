(function() {
  'use strict';

  angular.module('teamplay').config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('main-page', {
        url: '/',
        views: {
          "lobbies": {
            templateUrl: 'app/components/lobbies/lobbies.html',
            controller: 'LobbiesController',
            controllerAs: 'lobbies'  
          },
          "commentbox": {
            templateUrl: 'app/components/commentbox/commentbox.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentbox'            
          }
        }
        
      })
      .state('lobby-page', {
        url: '/lobby/{lobbyID}',
        views: {
          "lobbies": {
            templateUrl: 'app/components/lobbies/lobbypage.html',
            controller: 'LobbiesController',
            controllerAs: 'lobbies'  
          },
          "commentbox": {
            templateUrl: 'app/components/commentbox/commentbox.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentbox'            
          }
        }
    });

    $urlRouterProvider.otherwise('/');
  }

})();
