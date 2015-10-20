(function() {
  'use strict';


  var app = angular.module('tf2stadium');
  app.config(ThemeConfig);

  /** @ngInject */
  function ThemeConfig($mdThemingProvider) {

    var darkBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      '500': '4b9cd4'
    });

    var lightBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      '500': '99ccff'
    });

    var lightRedMap = $mdThemingProvider.extendPalette('red', {
      '500': 'ff9999'
    });

    $mdThemingProvider.definePalette('darkBluePalette', darkBlueMap);
    $mdThemingProvider.definePalette('lightBluePalette', lightBlueMap);
    $mdThemingProvider.definePalette('lightRedPalette', lightRedMap);
    $mdThemingProvider.theme('default')
      .primaryPalette('lightBluePalette')
      .accentPalette('lightBluePalette')
      .warnPalette('lightRedPalette');
  }

})();
