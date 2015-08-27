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
            templateUrl: 'app/shared/comment-box/comment-box.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentBox'            
          }
        }
      })
      .state('lobby-create', {
        url: '/create',
        views: {
          "content": {
            templateUrl: 'app/pages/lobby/create/lobby-create.html',
            controller: 'LobbyCreateController',
            controllerAs: 'lobbyCreate'
          },
          "commentbox": {
            templateUrl: 'app/shared/comment-box/comment-box.html',
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
            templateUrl: 'app/shared/comment-box/comment-box.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentbox'            
          },
          "headerText": {
            templateUrl: 'app/pages/lobby/page/header.html',
            controller: 'LobbyPageController',
            controllerAs: 'lobbyPage'            
          },
          "leftSidebar": {
            templateUrl: 'app/pages/lobby/page/spectators.html',
            controller: 'LobbyPageController',
            controllerAs: 'lobbyPage'            
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
            templateUrl: 'app/shared/comment-box/comment-box.html',
            controller: 'CommentBoxController',
            controllerAs: 'commentBox'            
          }
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
