(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('LobbyService', LobbyService);

  /** @ngInject */
  function LobbyService($rootScope, $state, $mdDialog, $timeout, Websocket) {
    var factory = {};
    var lobbySpectatorRequested = 0;

    factory.lobbyList = {};
    factory.lobbySpectated = {};
    factory.lobbyJoinInformation = {};

    factory.getLobbyJoinInformation = function() {
      return factory.lobbyJoinInformation;
    };

    factory.getList = function() {
      return factory.lobbyList;
    };

    factory.getLobbySpectated = function() {
      return factory.lobbySpectated;
    };

    factory.subscribe = function(request, scope, callback) {
      var handler = $rootScope.$on(request, callback);
      scope.$on('$destroy', handler);
    };

    factory.kick = function(lobbyID, steamID, banFromLobby) {
      var payload = {
        'id': lobbyID,
        'steamid': steamID,
        'ban': banFromLobby
      };

      Websocket.emitJSON('lobbyKick', payload, function(response) {
        if (response.success && steamID === '') {
          factory.spectate(lobbyID);
        }
      });
    };

    factory.join = function(lobby, team, position) {
      lobbySpectatorRequested = lobby;
      var payload = {
        'id': lobby,
        'team': team,
        'class': position
      };

      Websocket.emitJSON('lobbyJoin', payload);
    };

    factory.spectate = function(lobby) {
      lobbySpectatorRequested = lobby;

      //We could receive lobbyData before we receive the response to lobbyJoin,
      //so the onJSON event might never be fired.
      var handler = $rootScope.$on('lobby-spectated-updated', function() {
        $state.go('lobby-page', {lobbyID: lobby});
        handler();
      });

      Websocket.emitJSON('lobbySpectatorJoin', {id: lobby}, function(response) {
        if (!response.success) {
          if($state.current.name === 'lobby-page') {
            $state.go('lobby-list');
          }
          //If we are not allowed to spectate the lobby, there's no need to listen for updates
          handler();
        }
      });
    }

    factory.joinTF2Server = function() {
      $timeout(function(){
        window.open('steam://connect/' + factory.lobbyJoinInformation.game.host + '/' + factory.lobbyJoinInformation.password, '_self');
      }, 1000);
    };

    factory.joinMumbleServer = function() {
      //TODO
    };

    Websocket.onJSON('lobbyReadyUp', function(data) {
      $rootScope.$emit('lobby-ready-up');
      $mdDialog.show({
        templateUrl: 'app/shared/notifications/ready-up.html',
        controller: 'ReadyUpDialogController',
        controllerAs: 'dialog',
        locals: {
          timeout: data.timeout
        },
        bindToController: true
      })
      .then(function() {
          Websocket.emitJSON('playerReady', {});
        }, function() {
          Websocket.emitJSON('lobbyKick', {id : factory.lobbySpectated.id});
        }
      );
    });

    Websocket.onJSON('lobbyStart', function(data) {
      factory.lobbyJoinInformation = data;
      $state.go('lobby-page', {lobbyID: factory.lobbySpectated.id});
      factory.joinTF2Server();
      $rootScope.$emit('lobby-start');
    });

    Websocket.onJSON('lobbyListData', function(data) {
      factory.lobbyList = data.lobbies;
      $rootScope.$emit('lobby-list-updated');
    });

    Websocket.onJSON('lobbyData', function(data) {
      if (data.id === factory.lobbySpectated.id || data.id === lobbySpectatorRequested) {
        factory.lobbySpectated = data;
        $rootScope.$emit('lobby-spectated-updated');
      }
    });

    return factory;
  }

})();
