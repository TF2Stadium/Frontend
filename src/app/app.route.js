(function() {
  'use strict';

  angular.module('tf2stadium').config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('lobby-list', {
        url: '/',
        views: {
          "content": {
            templateUrl: 'app/pages/lobby/list/lobby-list.html',
            controller: 'LobbyListController',
            controllerAs: 'lobbyList'  
          },
          "commentbox": {
            templateUrl: 'app/pages/shared/comment-box/comment-box.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentBox'            
          }
        }
        
      })
      .state('lobby-page', {
        url: '/lobby/{lobbyID}',
        views: {
          "content": {
            templateUrl: 'app/pages/lobby/page/lobby-page.html',
            controller: 'LobbyPageController',
            controllerAs: 'lobbyPage'  
          },
          "commentbox": {
            templateUrl: 'app/pages/shared/comment-box/comment-box.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentbox'            
          }
        }
      })
      .state('settings', {
        url: '/settings',
        views: {
          "content": {
            templateUrl: 'app/pages/settings/settings.html',
            controller: 'SettingsController',
            controllerAs: 'settings'  
          },
          "commentbox": {
            templateUrl: 'app/pages/shared/comment-box/comment-box.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentBox'            
          }
        }
        
      });

    $urlRouterProvider.otherwise('/');
  }

})();
