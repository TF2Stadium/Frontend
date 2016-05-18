import aboutPage from '!!html!./about.html';
import aboutPageSidebar from '!!html!./about-sidebar.html';

export let module = angular.module('tf2stadium.about', ['ui.router']);

module
  .config(AboutPageConfig)
  .controller('AboutPageController', AboutPageController);

export let route = {
  url: '/about',
  redirectTo: 'about-about',
  views: {
    'content': {
      template: aboutPage,
      controller: 'AboutPageController',
      controllerAs: 'about',
    },
    'leftSidebar': {
      template: aboutPageSidebar,
      controller: 'AboutPageController',
      controllerAs: 'about',
    },
  },
};

const requireAbout = require.context('./', true, /\.md$/);

const SECTIONS = [
  'about',
  'faq',
  'changelog',
  'privacy',
  'servers',
  'credits',
];

// Needs to run at module load time to properly initialized the
// angular templateCache
SECTIONS.forEach(s => requireAbout('./section-' + s + '.md'));

/** @ngInject */
function AboutPageController() {
  var vm = this;
  vm.setCurrent = (key) => vm.current = key;
  vm.sections = SECTIONS;
}

/** @ngInject */
function AboutPageConfig($stateProvider) {
  SECTIONS.forEach((section) => {
    $stateProvider.state('about-' + section, {
      url: '/' + section,
      parent: 'about',
      views: {
        'about-section': {
          templateUrl: requireAbout('./section-' + section + '.md'),
        },
      },
    });
  });
}
