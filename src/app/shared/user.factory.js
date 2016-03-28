angular
  .module('tf2stadium.services')
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
          callback(response.data);
          deferred.resolve(response.data);
        } else {
          deferred.reject(response.message);
        }
      });

    return deferred.promise;
  };

  userService.getMumblePassword = function () {
    return Websocket.emitJSON('getMumblePassword', {});
  };

  userService.resetMumblePassword = function () {
    $window.open(Config.endpoints.api + '/resetMumblePassword', '_self');
  };

  userService.enableTwitchBot = function () {
    Websocket.emitJSON('playerEnableTwitchBot', {});
  };

  userService.disableTwitchBot = function () {
    Websocket.emitJSON('playerDisableTwitchBot', {});
  };

  userService.init = function () {
    Websocket.onJSON('playerProfile', function (data) {
      $rootScope.userProfile = data;
    });
  };

  return userService;
}
