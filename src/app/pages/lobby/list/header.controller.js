(function () {
  'use strict';

  angular.module('tf2stadium.controllers')
    .controller('LobbyListHeaderController', LobbyListHeaderController);

  /** @ngInject */
  function LobbyListHeaderController($scope, Settings) {
    var vm = this;

    Settings.getSettings(function (settings) {
      vm.filtersEnabled = settings.filtersEnabled;
    });

    vm.updateFilters = function () {
      Settings.set('filtersEnabled', vm.filtersEnabled);
    };
  }

})();
