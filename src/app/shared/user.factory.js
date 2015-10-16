(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.factory('User', User);

  /** @ngInject */
  function User(Websocket, $rootScope) {

    var userService = {};

    var userProfile = {};
    var alreadyLoadedFromBackend = false;

    userService.getProfile = function(callback) {
      
      callback = callback || angular.noop;

      if (alreadyLoadedFromBackend) {
        callback(userProfile);
        return userProfile;
      }

      getProfileFromBackend(function() {
        callback(userProfile);
      });
      return userProfile;
      
    };

    userService.init = function() {
      Websocket.onJSON('playerProfile', function(data) {
        $rootScope.userProfile = data;
      });
    }

    return userService;

  }

})();