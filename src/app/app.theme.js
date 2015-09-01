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

    var themes = {
      "light":  {name: "TF2Stadium", selector: "default-theme", id: "0"},
      "dark":   {name: "TF2Stadium Dark", selector: "dark-theme", id: "1"}
    }

    var currentTheme = {};

    themeService.notifyChanged = function() {
      $rootScope.$emit('theme-change');
    }

    themeService.subscribeList = function(scope, callback) {
      var handler = $rootScope.$on('theme-change', callback);
      scope.$on('$destroy', handler);
    }

    themeService.getThemes = function() {
      return themes;
    }

    themeService.getCurrentTheme = function() {
      return currentTheme;
    }

    themeService.setCurrentTheme = function(theme) {
      if (currentTheme != theme) {
        Settings.set('currentTheme', JSON.stringify(theme));
      }
      currentTheme = theme;
      themeService.notifyChanged();
    }

    /*
      Gets the user currentTheme setting and then iterates through 
      the themes list to see if there's a themeId match.
      
      If there is, it gets the object from the list and notifies the controllers.
    */
    Settings.loadSettings(function() {
      Settings.get('currentTheme', function(response) {
        var savedTheme = JSON.parse (response);
        for (var themeKey in themes) {
          var theme = themes[themeKey];
          if (theme.id == savedTheme.id) {
            currentTheme = theme;
            themeService.notifyChanged();
          }         
        }
      })
    });

    return themeService;

  }

  angular
  .module('tf2stadium')
  .controller('ThemeController', ThemeController);

  /** @ngInject */
  function ThemeController(ThemeService, $scope) {

    var vm = this;

    ThemeService.subscribeList($scope, function() {
      vm.currentTheme = ThemeService.getCurrentTheme();      
    });

    vm.themes = ThemeService.getThemes();

    vm.setCurrentTheme = function(theme) {
      ThemeService.setCurrentTheme(theme);
    }
  };

})();