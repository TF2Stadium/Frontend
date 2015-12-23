(function () {
  'use strict';

  angular
    .module('tf2stadium.controllers')
    .controller('SubListController', SubListController);

  /** @ngInject */
  function SubListController($scope, LobbyService) {
    var vm = this;

    vm.subList = LobbyService.getSubList();
    LobbyService.subscribe('sub-list-updated', $scope, function () {
      vm.subList = LobbyService.getSubList();
    });

  }
})();
