export const module = angular.module('tf2stadium.rules', ['ui.router']);

module
  .config(RulesPageConfig)
  .controller('RulesPageController', RulesPageController);

const rulesPage = `
<div id="rules-wrapper" ui-view="rules-section"></div>
`;

const rulesPageSidebar = `
<div id="sidebar-links">
  <h1 class="steps-title">
    Sections
  </h1>
  <md-button class="sidebar-link"
             ng-repeat="section in rules.sections"
             ng-class="{'active' : $root.currentState==='rules-'+section}"
             ui-sref="rules-{{::section}}">
    {{::section}}
  </md-button>
</div>
`;

export const route = {
  url: '/rules',
  redirectTo: 'rules-rules',
  views: {
    'content': {
      template: rulesPage,
      controller: 'RulesPageController',
      controllerAs: 'rules',
    },
    'leftSidebar': {
      template: rulesPageSidebar,
      controller: 'RulesPageController',
      controllerAs: 'rules',
    },
  },
};

const requirePage = require.context('./', true, /\.html$/);

const SECTIONS = [
  'rules',
  'punishments',
];

// Needs to run at module load time to properly initialized the
// angular templateCache
SECTIONS.forEach(s => requirePage('./section-' + s + '.html'));

/** @ngInject */
function RulesPageController() {
  var vm = this;
  vm.setCurrent = (key) => vm.current = key;
  vm.sections = SECTIONS;
}

/** @ngInject */
function RulesPageConfig($stateProvider) {
  SECTIONS.forEach((section) => {
    $stateProvider.state('rules-' + section, {
      url: '/' + section,
      parent: 'rules',
      views: {
        'rules-section': {
          templateUrl: requirePage('./section-' + section + '.html'),
        },
      },
    });
  });
}
