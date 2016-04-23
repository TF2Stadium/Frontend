angular.module('tf2stadium')
  .config(AboutPageConfig)
  .provider('AboutPage', AboutPage);

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

/** @ngInject */
function AboutPage() {
  var aboutPageProvider = { sections: SECTIONS };

  /** @ngInject */
  var aboutPageService = function () {
    var service = {};

    service.getSections = function () {
      return aboutPageProvider.sections;
    };

    return service;
  };

  aboutPageProvider.$get = aboutPageService;

  return aboutPageProvider;
}
