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
            cnt: vm.profile.stats[o.key],
            abbr: o.abbr
          };
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
            cnt: vm.profile.stats[className]
          };
        });

        // TODO: TEST DATA, remove once the backend supplies this
        if (angular.isUndefined(vm.profile.stats.leaves)) {
          vm.profile.stats.leaves = 0;
        }

      }, function (err) {
        vm.error = err;
        vm.loadingError = true;
      });
  }
})();
