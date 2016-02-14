(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('UserProfileController', UserProfileController);

  /** @ngInject */
  function UserProfileController($state, User) {
    var vm = this;

    vm.steamId = $state.params.userID;
    vm.steamUrl = 'http://steamcommunity.com/profiles/' + vm.steamId;

    vm.profile = {};
    vm.loadingError = false;

    User
      .getProfile(vm.steamId)
      .then(function (profile) {
        vm.profile = profile;
        vm.loadingError = false;

        vm.profile.createdAt = moment(vm.profile.createdAt * 1000);

        vm.profile.lobbyTypes = [
          {key: 'playedSixesCount',
           abbr: '6s',
           name: '6v6' },
          {key: 'playedHighlanderCount',
           abbr: 'HL',
           name: 'Highlander' },
          {key: 'PlayedFoursCount',
           abbr: '4s',
           name: '4v4'},
          {key: 'PlayedBballCount',
           abbr: 'BBall',
           name: 'BasketBall'},
          {key: 'PlayedUltiduoCount',
           abbr: 'Ulti',
           name: 'Ultiduo'}
        ].map(function (o) {
          o.cnt = vm.profile.stats[o.key];
          return o;
        });

        vm.profile.classes = [
          'scout',
          'soldier',
          'pyro',
          'demoman',
          'heavy',
          'engineer',
          'medic',
          'sniper',
          'spy'
        ].map(function (className) {
          return {
            name: className,
            cnt: vm.profile.stats[className] || 0
          };
        });

        vm.profile.external_links = [
          { name: 'logstf',
            img: '/assets/img/logos/logstf.svg',
            description: 'Logs.TF'},
          { name: 'ugc',
            img: '/assets/img/logos/ugc.png',
            description: 'United Gaming Clans' },
          { name: 'etf2l',
            img: '/assets/img/logos/etf2l.png',
            description: 'European TF2 League' }
        ].filter(function (l) {
          return vm.profile.external_links &&
            vm.profile.external_links.hasOwnProperty(l.name);
        }).map(function (l) {
          l.url = vm.profile.external_links[l.name];
          return l;
        });

        // TODO: TEST DATA, remove once the backend supplies this
        if (angular.isUndefined(vm.profile.stats.leaves)) {
          vm.profile.stats.leaves = 0;
        }

        vm.profile.lobbies = vm.profile.lobbies.map(function (map) {
          map.createdAt = moment(map.createdAt * 1000);

          map.playerInfo = map.classes.map(function (klass) {
            if (klass.blu.player.steamid === vm.steamId) {
              return { 'team': 'blu', 'class': klass.class };
            } else if (klass.red.player.steamid === vm.steamId) {
              return { 'team': 'red', 'class': klass.class };
            }
            return false;
          }).filter(function (x) { return x; });

          if (map.playerInfo.length > 0) {
            map.playerInfo = map.playerInfo[0];
          } else {
            // the backend sent back a lobby we weren't in :|
            return false;
          }

          return map;
        }).filter(function (x) { return x !== false; });

//        vm.profile.twitchChannel = "gcommer";

        vm.profile.stats.karma = vm.profile.stats.substitutes - vm.profile.stats.leaves;
      }, function (err) {
        vm.error = err;
        vm.loadingError = true;
      });
  }
})();
