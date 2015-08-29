(function() {
  'use strict';
  
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

  angular.module('tf2stadium').factory('themeService', function() {

    var themes = [
      {name: "TF2Stadium", selector: "default-theme"},
      {name: "TF2Stadium Dark", selector: "dark-theme"}
    ]

    var currentTheme = themes[1];

    return {
      getThemes: function() {
          return themes;
        },
      currentTheme: currentTheme
    };

  });

  angular.module('tf2stadium')
  .controller('ThemeController', ['$scope', 'themeService', function($scope, themeService) {

    $scope.themes = themeService.getThemes();
    $scope.currentTheme = themeService.currentTheme;

    $scope.setCurrentTheme = function(theme) {
      themeService.currentTheme = theme;
    }
    
    $scope.getCurrentTheme = function() {
      return themeService.currentTheme;
    }

  }]);

})();
