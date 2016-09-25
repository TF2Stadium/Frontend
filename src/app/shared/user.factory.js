/* @flow */
import Kefir from 'kefir';
import Raven from 'raven-js';
import {pick} from 'lodash';

angular
  .module('tf2stadium.services')
  .factory('User', User);

type SlotDetails = {
  name: string;
  steamid: string;
  player: {steamid: string};
};

export type LobbyData = {
  createdAt: string;
	id: number;
	mode: string;
	type: string;
	players: number;
	map: string;
	league: string;
	mumble: string;
	twitchChannel: string;
	twitchRestriction: string;
  classes: Array<{
    class: string;
    blu: SlotDetails;
    red: SlotDetails;
  }>;
	regionLock: string;
	steamGroup: string;
};
export type UserLobbyData = Array<LobbyData>;

/** @ngInject */
function User(Websocket, $rootScope, $window, $q, Config) {
  var userService = {};

  const {
    pub: updateUserProfile,
    stream: userProfile$,
  } = (function () {
    var pubFn = ()=>{};

    function pub(x) {
      pubFn(x);
    }

    var stream = Kefir.stream(emitter => {
      pubFn = (x) => emitter.emit(x);
      return () => {};
    });

    return { pub, stream };
  })();

  userService.userProfile$ = userProfile$;
  updateUserProfile({});

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

  userService.getLobbies = (steamid, cnt): Promise<UserLobbyData> =>
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
      updateUserProfile(data);
    });

  return userService;
}
