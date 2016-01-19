(function () {
  'use strict';

  angular.module('tf2stadium.directives')
    .directive('whitelist', WhitelistDirective);

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
})();
