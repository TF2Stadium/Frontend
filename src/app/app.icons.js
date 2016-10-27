/* @flow */
angular.module('tf2stadium')
  .config(registerIcons)
  .run(preloadIcons);

const requireImage = require.context('../assets/img/', true, /^.*\.(svg|png)$/);

// TODO: Change the icons to either be font based, or to be a single
// SVG icon set file (SVG file with groups with ids that are the
// icons' names)

var materialIconsBase = './icons/material/';
var materialIcons = [
  {name: 'add', file: 'add.svg'},
  {name: 'clear', file: 'clear.svg'},
  {name: 'menu', file: 'menu.svg'},
  {name: 'lock-closed-white', file: 'lock-closed-white.svg'},
  {name: 'error-red', file: 'error-red.svg'},
  {name: 'more-vert', file: 'more-vert.svg'},
  {name: 'search', file: 'search.svg'},
  {name: 'check-blue', file: 'check-blue.svg'},
  {name: 'lock-closed', file: 'lock-closed.svg'},
  {name: 'settings', file: 'settings.svg'},
  {name: 'favorite', file: 'favorite.svg'},
  {name: 'favorite-border', file: 'favorite-border.svg'},
];

var logosBase = './logos/';
var logoIcons = [
  {name: 'twitch', file: 'twitch.svg'},
  {name: 'steam', file: 'steam.svg'},
];

var classesBase = './icons/class/';
var classes = [
  'scout',
  'soldier',
  'pyro',
  'demoman',
  'heavy',
  'engineer',
  'medic',
  'sniper',
  'spy',
];

/** @ngInject */
function registerIcons($mdIconProvider) {
  materialIcons.forEach(function (desc) {
    $mdIconProvider
      .icon('material:' + desc.name,
            requireImage(materialIconsBase + desc.file));
  });

  logoIcons.forEach(function (desc) {
    $mdIconProvider
      .icon('logo:' + desc.name, requireImage(logosBase + desc.file));
  });

  classes
    .forEach(name =>
             $mdIconProvider.icon('class:' + name,
                                  requireImage(classesBase + name + '.svg')));

  $mdIconProvider.icon('logo:mumble', requireImage('./mumble.svg'));
  $mdIconProvider.icon('logo:not-mumble', requireImage('./not-mumble.svg'));
}

/** @ngInject */
function preloadIcons($http, $templateCache) {
  materialIcons
    .map(desc => materialIconsBase + desc.file)
    .map(requireImage)
    .forEach(preload);

  function preload(url) {
    $http.get(url, {cache: $templateCache});
  }
}
