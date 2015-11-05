(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('LobbyService', LobbyService);

  /** @ngInject */
  function LobbyService($rootScope, $state, $mdDialog, $timeout, $interval, Websocket, Notifications) {
    var factory = {};

    factory.lobbyList = {};
    factory.lobbySpectated = {};
    factory.lobbyJoinInformation = {};

    var playerPreReady = false;
    var preReadyUpTimer = 0;
    var preReadyUpInterval;

    factory.getLobbyJoinInformation = function() {
      return factory.lobbyJoinInformation;
    };

    factory.getList = function() {
      return factory.lobbyList;
    };

    factory.getLobbySpectated = function() {
      return factory.lobbySpectated;
    };

    factory.getPlayerPreReady = function() {
      return playerPreReady;
    };

    factory.setPlayerPreReady = function(isReady) {
      playerPreReady = isReady;

      if (!playerPreReady) {
        $interval.cancel(preReadyUpInterval);
        return;
      }

      preReadyUpTimer = 180;

      preReadyUpInterval = $interval(function() {
        preReadyUpTimer--;

        if (preReadyUpTimer <= 0) {
          playerPreReady = false;
          $interval.cancel(preReadyUpInterval);
        }
      }, 1000);
    };

    factory.getPreReadyUpTimer = function() {
      return preReadyUpTimer;
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
      var payload = {
        'id': lobby,
        'team': team,
        'class': position
      };

      Websocket.emitJSON('lobbyJoin', payload);
    };

    factory.goToLobby = function(lobby) {
      $state.go('lobby-page', {lobbyID: lobby});
    };

    factory.spectate = function(lobby) {
      Websocket.emitJSON('lobbySpectatorJoin', {id: lobby}, function(response) {
        if (!response.success) {
          if($state.current.name === 'lobby-page') {
            $state.go('lobby-list');
          }
        }
      });
    };

    factory.closeLobby = function(lobbyID) {
      Websocket.emitJSON('lobbyClose', {id: lobbyID}, function(response) {
        if(response.success && $state.current.name === 'lobby-page') {
          $state.go('lobby-list');
        }
      });
    };

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
      if (playerPreReady) {
        Websocket.emitJSON('playerReady', {});
        return;
      }
      $mdDialog.show({
        templateUrl: 'app/shared/notifications/ready-up.html',
        controller: 'ReadyUpDialogController',
        controllerAs: 'dialog',
        locals: {
          timeout: 30
        },
        bindToController: true
      })
      .then(function(response) {
          if (response.readyUp) {
            Websocket.emitJSON('playerReady', {});
            localStorage.setItem('tabCommunication', '');
            localStorage.setItem('tabCommunication', 'closeDialog');
          }
        }, function() {
          Websocket.emitJSON('playerNotReady', {});
          localStorage.setItem('tabCommunication', '');
          localStorage.setItem('tabCommunication', 'closeDialog');
        }
      );
      Notifications.notifyBrowser({
        title: 'Click here to ready up!',
        body: 'All the slots are filled, ready up to start',
        timeout: 30,
        callbacks: {
          onclick: function() {
            window.focus();
          }
        }
      });
    });

    Websocket.onJSON('lobbyStart', function(data) {
      factory.lobbyJoinInformation = data;
      $state.go('lobby-page', {lobbyID: factory.lobbySpectated.id});
      $rootScope.$emit('lobby-start');
      Notifications.notifyBrowser({
        title: 'Lobby is starting!',
        body: 'Come back to the site to join the server',
        timeout: 5,
        callbacks: {
          onclick: function() {
            window.focus();
          }
        }
      });
    });

    Websocket.onJSON('lobbyListData', function(data) {
      factory.lobbyList = data.lobbies;
      $rootScope.$emit('lobby-list-updated');
    });

    Websocket.onJSON('lobbyData', function(data) {
      var oldLobbyId = factory.lobbySpectated.id;
      factory.lobbySpectated = data;
      if (data.id !== oldLobbyId) {
        $rootScope.$emit('lobby-spectated-changed');
      }
      $rootScope.$emit('lobby-spectated-updated');
    });

    return factory;
  }

})();
