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

        vm.profile.lobbyTypes = [
          {key: 'playedSixesCount', abbr: '6s'},
          {key: 'playedHighlanderCount', abbr: 'HL'},
          {key: 'PlayedFoursCount', abbr: '4s'},
          {key: 'PlayedBballCount', abbr: 'BB'},
          {key: 'PlayedUltiduoCount', abbr: 'UD'}
        ].map(function (o) {
          return {
            cnt: Math.floor(160*Math.random()),//vm.profile.stats[o.key],
            abbr: o.abbr
          };
        }); // .sort(function (o) { return o.cnt; });

        vm.profile.classes = [
          {cnt: 5, name: 'scout'},
          {cnt: 293, name: 'soldier'},
          {cnt: -1, name: 'pyro'},
          {cnt: 15, name: 'demoman'},
          {cnt: 1, name: 'heavy'},
          {cnt: 0.5, name: 'engineer'},
          {cnt: 294, name: 'medic'},
          {cnt: 33, name: 'sniper'},
          {cnt: 7134, name: 'spy'}
        ];

        vm.profile.stats.lobbiesPlayed = 578;
        vm.profile.stats.substitutes = 40;
        vm.profile.stats.leaves = 5;


      }, function (err) {
        vm.error = err;
        vm.loadingError = true;
      });

  }
})();
