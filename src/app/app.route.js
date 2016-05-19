import {route as about} from './pages/about';
import {route as rules} from './pages/rules';

/** @ngInject */
export default function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('lobby-list', {
      url: '/',
      views: {
        'content': {
          templateUrl: 'app/pages/lobby/list/lobby-list.html',
          controller: 'LobbyListController',
          controllerAs: 'lobbyList',
        },
        'headerInfo': {
          templateUrl: 'app/pages/lobby/list/header.html',
          controller: 'LobbyListHeaderController',
          controllerAs: 'header',
        },
      },
    })
    .state('lobby-create', {
      url: '/create',
      views: {
        'content': {
          templateUrl: 'app/pages/lobby/create/lobby-create.html',
          controller: 'LobbyCreateController',
          controllerAs: 'lobbyCreate',
        },
        'headerInfo': {
          templateUrl: 'app/pages/lobby/create/header.html',
          controller: 'LobbyCreateHeaderController',
          controllerAs: 'header',
        },
        'leftSidebar': {
          templateUrl: 'app/pages/lobby/create/lobby-create-steps.html',
          controller: 'WizardStepsController',
          controllerAs: 'wizardSteps',
        },
      },
    })
    .state('lobby-page', {
      url: '/lobby/{lobbyID}',
      views: {
        'content': {
          templateUrl: 'app/pages/lobby/page/lobby-page.html',
          controller: 'LobbyPageController',
          controllerAs: 'lobbyPage',
        },
        'headerInfo': {
          templateUrl: 'app/pages/lobby/page/header.html',
          controller: 'LobbyPageHeaderController',
          controllerAs: 'header',
        },
        'leftSidebar': {
          templateUrl: 'app/pages/lobby/page/spectators.html',
          controller: 'LobbyPageSpectatorsController',
          controllerAs: 'spectators',
        },
      },
    })
    .state('user-profile', {
      url: '/user/{userID}',
      views: {
        'content': {
          templateUrl: 'app/pages/user-profile/user-profile.html',
          controller: 'UserProfileController',
          controllerAs: 'userProfile',
        },
        'headerInfo': {
          templateUrl: 'app/pages/user-profile/header.html',
          controller: 'UserProfileHeaderController',
          controllerAs: 'header',
        },
      },
    })
    .state('settings', {
      url: '/settings',
      redirectTo: 'theme',
      views: {
        'content': {
          templateUrl: 'app/pages/settings/settings.html',
          controller: 'SettingsPageController',
          controllerAs: 'settings',
        },
        'leftSidebar': {
          templateUrl: 'app/pages/settings/settings-sidebar.html',
          controller: 'SettingsPageController',
          controllerAs: 'settings',
        },
      },
    })
    .state('about', about)
    .state('rules', rules);

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);
}
