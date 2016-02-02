(function () {
  'use strict';

  angular.module('tf2stadium')
    .config(registerIcons)
    .run(preloadIcons);

  // TODO: Change the icons to either be font based, or to be a single
  // SVG icon set file (SVG file with groups with ids that are the
  // icons' names)
  var materialIcons = [
    {name: 'add', file: 'add.svg'},
    {name: 'clear', file: 'clear.svg'},
    {name: 'lock-closed-white', file: 'lock-closed-white.svg'},
    {name: 'error-red', file: 'error-red.svg'},
    {name: 'more-vert', file: 'more-vert.svg'},
    {name: 'search', file: 'search.svg'},
    {name: 'check-blue', file: 'check-blue.svg'},
    {name: 'lock-closed', file: 'lock-closed.svg'},
    {name: 'settings', file: 'settings.svg'}
  ];

  var materialIconsBase = '/assets/img/icons/material/';

  /** @ngInject */
  function registerIcons($mdIconProvider) {
    materialIcons.forEach(function (desc) {
      $mdIconProvider
        .icon('material:' + desc.name, materialIconsBase + desc.file);
    });
  }

  /** @ngInject */
  function preloadIcons($http, $templateCache) {
    materialIcons.map(descToURL).forEach(preload);

    function descToURL(desc) {
      return materialIconsBase + desc.file;
    }

    function preload(url) {
      $http.get(url, {cache: $templateCache});
    }
  }

})();
