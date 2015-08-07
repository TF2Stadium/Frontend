(function() {
  'use strict';

  angular.module('tf2stadium').config(mdThemingProvider);

  function mdThemingProvider($mdThemingProvider){
    var darkBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      '500': '4b9cd4'
    });
    var lightBlueMap = $mdThemingProvider.extendPalette('light-blue', {
      '500': '99ccff'
    });
    $mdThemingProvider.definePalette('darkBluePalette', darkBlueMap);
    $mdThemingProvider.definePalette('lightBluePalette', lightBlueMap);
    $mdThemingProvider.theme('default')
      .primaryPalette('darkBluePalette')
      .accentPalette('lightBluePalette');
  }


});