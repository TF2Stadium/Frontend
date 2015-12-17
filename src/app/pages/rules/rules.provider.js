(function () {
  'use strict';

  angular.module('tf2stadium')
    .config(RulesPageConfig)
    .provider('RulesPage', RulesPage);

  /** @ngInject */
  function RulesPageConfig($stateProvider, RulesPageProvider) {
    RulesPageProvider.sections.forEach(function (section) {
      $stateProvider.state('rules-' + section, {
        url: '/' + section,
        parent: 'rules',
        views: {
          'rules-section': {
            templateUrl: 'app/pages/rules/section-' + section + '.html'
          }
        }
      });
    });
  }

  /** @ngInject */
  function RulesPage() {
    var rulesPageProvider = {
      sections: [
        'rules',
        'punishments'
      ]
    };

    /** @ngInject */
    var rulesPageService = function () {
      var service = {};

      service.getSections = function () {
        return rulesPageProvider.sections;
      };

      return service;
    };

    rulesPageProvider.$get = rulesPageService;

    return rulesPageProvider;
  }

})();
