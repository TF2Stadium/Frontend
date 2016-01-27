(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('PreloadService', PreloadService);

  /** @ngInject */
  function PreloadService($window) {
    // Never attempt to preload the same image multiple times. This
    // isn't a huge deal, since making multiple requests for the same
    // image will get stopped by the cache, but if we're ever
    // attempting to preload images that don't exist (mainly happens
    // during development), we don't end up spamming requests for that
    // image (since 404s aren't cached).
    var alreadyQueued = Object.create(null);

    return {
      queuePreload: function preload(src) {
        if (!alreadyQueued[src]) {
          var img = new $window.Image();
          img.src = src;
          alreadyQueued[src] = true;
        }
      }
    };
  }

})();
