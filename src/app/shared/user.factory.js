(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('User', User);

  /** @ngInject */
  function User(Websocket, $rootScope, $window, $q, Config) {

    var userService = {};

    userService.getProfile = function (steamid, callback) {
      callback = callback || angular.noop;

      var deferred = $q.defer();

      Websocket.emitJSON(
        'playerProfile',
        { steamid: steamid },
        function (response) {
          if (response.success) {
            deferred.resolve(response.data);
          } else {
            deferred.reject(response.message);
          }
        });

      return deferred.promise;
    };

    userService.logout = function () {
      $window.open(Config.endpoints.api + '/logout', '_self');
    };

    userService.twitchLogout = function () {
      $window.open(Config.endpoints.api+'/twitchLogout', '_self');
    };

    userService.init = function () {
      Websocket.onJSON('playerProfile', function (data) {
        $rootScope.userProfile = data;
      });
    };

    return userService;
  }

})();
