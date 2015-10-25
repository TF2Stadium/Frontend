(function() {
  'use strict';

  angular.module('tf2stadium').config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('lobby-list', {
        url: '/',
        views: {
          "content": {
            templateUrl: 'app/pages/lobby/list/lobby-list.html',
            controller: 'LobbyListController',
            controllerAs: 'lobbyList'
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
          "leftSidebar": {
            templateUrl: 'app/pages/lobby/create/lobby-create-steps.html',
            controller: 'WizardStepsController',
            controllerAs: 'wizardSteps'
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
          "headerInfo": {
            templateUrl: 'app/pages/lobby/page/header.html',
            controller: 'LobbyPageHeaderController',
            controllerAs: 'header'
          },
          "leftSidebar": {
            templateUrl: 'app/pages/lobby/page/spectators.html',
            controller: 'LobbyPageSpectatorsController',
            controllerAs: 'spectators'
          }
        }
      })
      .state('settings', {
        url: '/settings',
        redirectTo: 'theme',
        views: {
          "content": {
            templateUrl: 'app/pages/settings/settings.html',
            controller: 'SettingsPageController',
            controllerAs: 'settings'
          },
          "leftSidebar": {
            templateUrl: 'app/pages/settings/settings-sidebar.html',
            controller: 'SettingsPageController',
            controllerAs: 'settings'
          }
        }
      });

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  }

})();
