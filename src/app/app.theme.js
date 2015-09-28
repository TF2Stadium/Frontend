(function() {
  'use strict';


  var app = angular.module('tf2stadium');
  app.config(ThemeConfig);
  app.factory('ThemeService', ThemeService);

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
      .primaryPalette('darkBluePalette')
      .accentPalette('lightBluePalette')
      .warnPalette('lightRedPalette');
  }


  /** @ngInject */
  function ThemeService($rootScope, Settings) {

    var themeService = {};

    var themes = Settings.getConstants('themesList');

    themeService.getThemes = function() {
      return themes;
    };

    themeService.getCurrentTheme = function() {
      return $rootScope.currentTheme;
    };

    themeService.setCurrentTheme = function(theme) {
      $rootScope.currentTheme = theme;
        Settings.set('currentTheme', theme, function(response) {
          console.log(response);
        });

      if ($rootScope.currentTheme !== theme) {
      }
    };
    
    $rootScope.currentTheme = Settings.get('currentTheme', function(response) {
      $rootScope.currentTheme = response;
    });

    return themeService;

  }

})();
