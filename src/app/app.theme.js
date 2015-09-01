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

  angular
  .module('tf2stadium')
  .factory('ThemeService', ThemeService);

  /** @ngInject */
  function ThemeService(Websocket, $rootScope, Settings) {

    var themeService = {};

    var themes = Settings.getConstants('themesList');

    themeService.getThemes = function() {
      return themes;
    }

    themeService.getCurrentTheme = function() {
      return $rootScope.currentTheme;
    }

    themeService.setCurrentTheme = function(theme) {
      $rootScope.currentTheme = theme;
        Settings.set('currentTheme', theme, function(response) {
          console.log(response)
        });

      if ($rootScope.currentTheme != theme) {
      }
    }

    Settings.loadSettings(function() {
      Settings.get('currentTheme', function(response) {
        $rootScope.currentTheme = response;
      })
    });

    return themeService;

  }

  angular
  .module('tf2stadium')
  .controller('ThemeController', ThemeController);

  /** @ngInject */
  function ThemeController(ThemeService) {

    var vm = this;
    vm.themes = ThemeService.getThemes();    

    vm.saveCurrentTheme = function(theme) {
      ThemeService.setCurrentTheme(theme);
    }
    
  };

})();