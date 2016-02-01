(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('UserProfileController', UserProfileController);

  /** @ngInject */
  function UserProfileController($state) {
    var vm = this;

    vm.steamid = $state.params.userID;
  }
})();
