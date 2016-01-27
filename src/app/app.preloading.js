(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('PreloadService', PreloadService);

  /** @ngInject */
  function PreloadService($window) {
    return {
      queuePreload: function preload(src) {
        var img = new $window.Image();
        img.src = src;
      }
    };
  }

})();
