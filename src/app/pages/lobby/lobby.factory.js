(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('LobbyService', LobbyService);

  /** @ngInject */
  function LobbyService(Websocket, $rootScope, $mdDialog) {
    var factory = {};

    factory.lobbyList = {};
    factory.lobbyActive = {};

    factory.getList = function() {
      return factory.lobbyList;
    };

    factory.subscribeList = function(scope, callback) {
      var handler = $rootScope.$on('lobby-list-updated', callback);
      scope.$on('$destroy', handler);
    };

    factory.getActive = function() {
      return factory.lobbyActive;
    };

    factory.subscribeActive = function(scope, callback) {
      var handler = $rootScope.$on('lobby-active-updated', callback);
      scope.$on('$destroy', handler);
    };

    factory.subscribe = function(request, scope, callback) {
      var handler = $rootScope.$on(request, callback);
      scope.$on('$destroy', handler);
    }

    Websocket.onJSON('lobbyReadyUp', function(data) {
      $rootScope.$emit('lobby-ready-up');
      $mdDialog.show({
        templateUrl: 'app/shared/notifications/ready-up.html',
        controller: 'ReadyUpDialogController',
        controllerAs: 'dialog'
      })
      .then(function(response) {
        if (response === 'ready') {
          Websocket.emitJSON('playerReady', {});
        } else {
          Websocket.emitJSON('lobbyKick', {id : factory.lobbyActive.id});
        }
      });
    });

    Websocket.onJSON('lobbyStart', function(data) {
      console.log('lobbyStart');
      $rootScope.$emit('lobby-start');
    });

    Websocket.onJSON('lobbyListData', function(data) {
      factory.lobbyList = data.lobbies;
      $rootScope.$emit('lobby-list-updated');
    });

    Websocket.onJSON('lobbyData', function(data) {
      factory.lobbyActive = data;
      $rootScope.$emit('lobby-active-updated');
    });

    return factory;
  }

})();
