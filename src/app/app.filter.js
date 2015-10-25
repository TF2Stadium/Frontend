(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.filter('capitalize', capitalize);
  app.filter('reverse', reverse);
  app.filter('trusted', trusted);
  app.filter('classNameFilter', classNameFilter);

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

  /** @ngInject */
  function classNameFilter() {
    return function(className) {
      return className.replace(/\d+$/, "");
    };
  }

})();
