export const module = angular.module('tf2stadium.about', ['ui.router']);

module
  .config(AboutPageConfig)
  .controller('AboutPageController', AboutPageController);

const aboutPage = `
<div id="about-wrapper" ui-view="about-section" class="settings-section">
</div>
`;

const aboutPageSidebar = `
<div id="sidebar-links">
  <h1 class="steps-title">
    Sections
  </h1>
  <md-button class="sidebar-link"
             ng-repeat="aboutSection in about.sections"
             ng-class="{'active' : $root.currentState==='about-'+aboutSection}"
             ui-sref="about-{{::aboutSection}}">
    {{::aboutSection}}
  </md-button>
</div>
`;

export const route = {
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
