import Raven from 'raven-js';
import {pick} from 'lodash';

angular
  .module('tf2stadium.services')
  .factory('User', User);

/** @ngInject */
function User(Websocket, $rootScope, $window, $q, Config) {

  var userService = {};

  userService.getProfile = (steamid, callback) => {
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

  userService.getLobbies = (steamid, cnt) =>
    Websocket.emitJSON('playerRecentLobbies', {
      steamid,
      lobbies: cnt,
    });

  userService.getMumblePassword =
    () => Websocket.emitJSON('getMumblePassword', {});

  userService.resetMumblePassword =
    () => $window.open(Config.endpoints.api + '/resetMumblePassword', '_self');

  userService.enableTwitchBot =
    () => Websocket.emitJSON('playerEnableTwitchBot', {});

  userService.disableTwitchBot =
    () => Websocket.emitJSON('playerDisableTwitchBot', {});

  userService.init = () =>
    Websocket.onJSON('playerProfile', function (data) {
      Raven.setUserContext(pick(data, ['id', 'steamid']));
      $rootScope.userProfile = data;
    });

  return userService;
}
