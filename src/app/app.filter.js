(function() {
  'use strict';

  var app = angular.module('tf2stadium');

  app.filter('reverse', reverse);
  app.filter('trusted', trusted);

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
