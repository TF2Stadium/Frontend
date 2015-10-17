(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.factory('User', User);

  /** @ngInject */
  function User(Websocket, $rootScope) {

    var userService = {};

    var userProfile = {};
    var alreadyLoadedFromBackend = false;

    userService.getUserProfile = function(callback) {

      callback = callback || angular.noop;

      if (!alreadyLoadedFromBackend) {
        userService.getProfile ('', function(response) {
          if (response.success) {
            userProfile = response.data;
          }
          callback(response.data);
        });
      } else {
        callback(userProfile);
      }

      return userProfile;

    };

    userService.getProfile = function(steamid, callback) {

      callback = callback || angular.noop;

      Websocket.emitJSON('playerProfile',
        {steamid: steamid},
        function(response) {
          callback(response.data);
        }
      );

    };

    userService.init = function() {
      Websocket.onJSON('playerProfile', function(data) {
        $rootScope.userProfile = data;
        alreadyLoadedFromBackend = true;
      });
    };

    return userService;

  }

})();
