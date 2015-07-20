(function() {
  'use strict';

  angular.module('teamplay').config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('lobbies', {
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
      .state('lobbies-view', {
        url: '/lobbies/{lobbyID}',
        templateUrl: 'app/components/lobbies/lobby.html',
        controller: 'LobbyController',
        controllerAs: 'lobby'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
