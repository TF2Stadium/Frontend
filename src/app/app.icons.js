(function () {
  'use strict';

  angular.module('tf2stadium')
    .config(registerIcons)
    .run(preloadIcons);

  // TODO: Change the icons to either be font based, or to be a single
  // SVG icon set file (SVG file with groups with ids that are the
  // icons' names)
  var materialIconsBase = '/assets/img/icons/material/';
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

  var logosBase = '/assets/img/logos/';
  var logoIcons = [
    {name: 'twitch', file: 'twitch.svg'},
    {name: 'steam', file: 'steam.svg'}
  ];

  var classesBase = '/assets/img/class/class-icon-';
  var classes = [
    'scout',
    'soldier',
    'pyro',
    'demoman',
    'heavy',
    'engineer',
    'medic',
    'sniper',
    'spy'
  ];

  /** @ngInject */
  function registerIcons($mdIconProvider) {
    materialIcons.forEach(function (desc) {
      $mdIconProvider
        .icon('material:' + desc.name, materialIconsBase + desc.file);
    });

    logoIcons.forEach(function (desc) {
      $mdIconProvider
        .icon('logo:' + desc.name, logosBase + desc.file);
    });

    classes.forEach(function (name) {
      $mdIconProvider
        .icon('class:' + name, classesBase + name + '.svg');
    });

    $mdIconProvider.icon('logo:mumble', '/assets/img/mumble.svg');
    $mdIconProvider.icon('logo:not-mumble', '/assets/img/not-mumble.svg');
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
