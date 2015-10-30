(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.filter('capitalize', capitalize);
  app.filter('reverse', reverse);
  app.filter('trusted', trusted);
  app.filter('classNameFilter', classNameFilter);
  app.filter('secondsToMinutes', secondsToMinutes);

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

  /** @ngInject */
  function secondsToMinutes() {
    return function(seconds) {
      var minutes = Math.floor(seconds / 60);
      var seconds = seconds % 60;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return minutes + ':' + seconds;
    };
  }

})();
