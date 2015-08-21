angular.module('tf2stadium')
.config(function($mdThemingProvider) {
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
});