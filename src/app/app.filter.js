(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.filter('capitalize', capitalize);
  app.filter('reverse', reverse);
  app.filter('trusted', trusted);

  /** @ngInject */
  function capitalize() {
    return function(input) {
      return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase();
    };
  }

  /** @ngInject */
  function reverse(){
    return function(items) {
      return items.slice().reverse();
    };
  }

  /** @ngInject */
  function trusted($sce) {
    return function(url) {
      return $sce.trustAsResourceUrl(url);
    };
  }

})();
