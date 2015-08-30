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

  angular.module('tf2stadium').factory('$themeService', ThemeService);

  /** @ngInject */
  function ThemeService(Websocket) {

    var themeService = {};

    themeService.themes = [
      {name: "TF2Stadium", selector: "default-theme", id: 0},
      {name: "TF2Stadium Dark", selector: "dark-theme", id: 1}
    ]

    themeService.currentTheme = themeService.themes[0];

    themeService.readThemeSettings = function () {
      Websocket.emit('playerSettingsGet',
        JSON.stringify({key: 'theme'}),
        function(data) {
          var response = JSON.parse(data);
          themeService.currentTheme = JSON.parse(response.data.theme);
        }
      );
    }

    themeService.saveThemeSettings = function () {
      Websocket.emit('playerSettingsSet',
        JSON.stringify({key: 'theme', value: JSON.stringify(currentTheme)}),
        function(data) {
          var response = JSON.parse(data);
        }
      );
    }

    themeService.readThemeSettings();

    return themeService;

  }

  angular.module('tf2stadium')
  .controller('ThemeController', ['$scope', '$themeService', function($scope, $themeService) {

    $scope.themes = $themeService.themes;
    $scope.currentTheme = $themeService.currentTheme;

    $scope.setCurrentTheme = function(theme) {
      $themeService.currentTheme = theme;
    }
    
    $scope.getCurrentTheme = function() {
      return $themeService.currentTheme;
    }

  }]);

})();