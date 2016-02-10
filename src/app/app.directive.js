(function () {
  'use strict';

  angular.module('tf2stadium.directives')
    .directive('whitelist', WhitelistDirective)
    .directive('autofocus', AutofocusDirective);

  function WhitelistDirective() {
    return {
      restrict: 'E',
      scope: {
        whitelistId: '=id'
      },
      template: '{{whitelistId | ifNumeric:"#"}}'
        + '<a target="_blank" href="http://whitelist.tf/{{whitelistId}}">'
        + '{{whitelistId}}'
        + '</a>'
    };
  }

  /** @ngInject */
  function AutofocusDirective($timeout) {
    // Directive for automatically an element when it is added, such
    // as via `ng-if`
    return {
      restrict: 'A',
      link: function link(scope, element) {
        $timeout(function () {
          element.focus();
        });
      }
    };
  }


})();
