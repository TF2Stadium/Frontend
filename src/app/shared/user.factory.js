(function() {
  'use strict';

  var app = angular.module('tf2stadium');
  app.factory('User', User);

  /** @ngInject */
  function User(Websocket) {

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

    var getProfileFromBackend = function(callback) {
      callback = callback || angular.noop;

      Websocket.emit('playerProfile',
        JSON.stringify({steamid: ''}), //current user
        function(data) {
          var response = JSON.parse(data);
          if (response.success) {
            userProfile = response.data;
            alreadyLoadedFromBackend = true;
          }
          callback();
        }
      );
    };

    return userService;

  }

})();