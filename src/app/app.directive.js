(function () {
  'use strict';

  angular.module('tf2stadium.directives')
    .directive('whitelist', function () {
      return {
        restrict: 'E',
        scope: {
          whitelistId: '=id'
        },
        template:
        'whitelist '
          + '{{whitelistId | ifNumeric:"#"}}'
          + '<a target="_blank" href="http://whitelist.tf/{{whitelistId}}">'
          + '{{whitelistId}}'
          + '</a>'
      };
    });
})();
