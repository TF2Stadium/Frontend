/* globals io */
(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('LobbyService', LobbyService);

  /** @ngInject */
  function LobbyService(Websocket, $rootScope)
  {
    Websocket.on("lobbyListData", function (data) {
      factory.lobbyList = JSON.parse(data).lobbies;
      factory.notifyList();
    });

    Websocket.on("lobbyData", function (data) {
      factory.lobbyActive = JSON.parse(data);
      console.log(JSON.parse(data));
      factory.notifyActive();
    });

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

    factory.notifyList = function() {
      $rootScope.$emit('lobby-list-updated');
    };

    factory.getActive = function() {
      return factory.lobbyActive;
    };

    factory.subscribeActive = function(scope, callback) {
      var handler = $rootScope.$on('lobby-active-updated', callback);
      scope.$on('$destroy', handler);
    };

    factory.notifyActive = function() {
      $rootScope.$emit('lobby-active-updated');
    };

    return factory
  }
})();
