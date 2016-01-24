(function () {
  'use strict';

  angular.module('tf2stadium')
    .config(AboutPageConfig)
    .provider('AboutPage', AboutPage);

  /** @ngInject */
  function AboutPageConfig($stateProvider, AboutPageProvider) {
    AboutPageProvider.sections.forEach(function (section) {
      $stateProvider.state('about-' + section, {
        url: '/' + section,
        parent: 'about',
        views: {
          'about-section': {
            templateUrl: 'app/pages/about/section-' + section + '.html'
          }
        }
      });
    });
  }

  /** @ngInject */
  function AboutPage() {
    var aboutPageProvider = {
      sections: [
        'about',
        'privacy',
        'servers'
      ]
    };

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

})();
