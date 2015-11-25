(function() {
  'use strict';

  angular.module('tf2stadium.services').factory('LobbyService', LobbyService);

  /** @ngInject */
  function LobbyService($rootScope, $state, $mdDialog, $timeout, $interval,
                        Websocket, Notifications, User) {
    var factory = {};

    factory.lobbyList = {};

    // map lobby id -> last seen data
    factory.lobbyData = Object.create(null);

    factory.lobbySpectatedId = -1;
    factory.lobbyJoinedId = -1;

    factory.subList = {};
    factory.lobbyJoinInformation = {};

    var playerPreReady = false;
    var preReadyUpTimer = 0;
    var preReadyUpInterval;

    factory.getLobbyJoinInformation = function() {
      return factory.lobbyJoinInformation;
    };

    factory.getSubList = function() {
      return factory.subList;
    };

    factory.getList = function() {
      return factory.lobbyList;
    };

    // Will return undefined when a lobby is not currently being
    // spectated
    factory.getLobbySpectated = function() {
      return factory.lobbyData[factory.lobbySpectatedId];
    };

    // Will return -1 when a lobby is not currently being
    // spectated
    factory.getLobbySpectatedId = function() {
      return factory.lobbySpectatedId;
    };

    factory.leaveSpectatedLobby = function() {
      factory.lobbySpectatedId = -1;
      $rootScope.$emit('lobby-spectated-changed');
      $rootScope.$emit('lobby-spectated-updated');
    };

    // Will return undefined when not currently joined in any
    // lobby
    factory.getLobbyJoined = function() {
      return factory.lobbyData[factory.lobbyJoinedId];
    };

    // Will return -1 when not currently joined in any
    // lobby
    factory.getLobbyJoinedId = function() {
      return factory.lobbyJoinedId;
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

      Websocket.emitJSON('lobbyJoin', payload, function (response) {
        if (response.success) {
          // lobbyJoin is now handled later in a dedicated lobbyJoin
          // event message handler (a separate event, not the response
          // to this lobbyJoin request)
          // $rootScope.$emit('lobby-joined', lobby);
        }
      });
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
        } else {
          var oldLobbyId = factory.lobbySpectatedId;
          factory.lobbySpectatedId = lobby;

          if (lobby !== oldLobbyId) {
            $rootScope.$emit('lobby-spectated-changed');
          }
          $rootScope.$emit('lobby-spectated-updated');
        }
      });
    };

    factory.closeLobby = function(lobbyID) {
      Websocket.emitJSON('lobbyClose', {id: lobbyID});
    };

    factory.resetServer = function(lobbyID) {
      Websocket.emitJSON('lobbyServerReset', {id: lobbyID});
    };

    factory.joinTF2Server = function() {
      $timeout(function(){
        window.open('steam://connect/' + factory.lobbyJoinInformation.game.host + '/' + factory.lobbyJoinInformation.password, '_self');
      }, 1000);
    };

    factory.joinMumbleServer = function() {
      $timeout(function(){
        var connectString = 'mumble://' +
          factory.lobbyJoinInformation.mumble.nick + ':' +
          factory.lobbyJoinInformation.mumble.password + '@' +
          factory.lobbyJoinInformation.mumble.address + ':' +
          factory.lobbyJoinInformation.mumble.port + '/?version=1.2.0&title=TF2Stadium&url=tf2stadium.com';
        window.open(connectString, '_self');
      }, 1000);
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
        });
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
      $state.go('lobby-page', {lobbyID: factory.lobbySpectatedId});
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

    Websocket.onJSON('subListData', function(data) {
      factory.subList = data.data;
      $rootScope.$emit('sub-list-updated');
    });

    Websocket.onJSON('lobbyListData', function(data) {
      factory.lobbyList = data.lobbies;
      $rootScope.$emit('lobby-list-updated');

      if (factory.lobbyJoinedId === -1) {
        return;
      }

      factory.lobbyList.forEach(function(lobby) {
        if (lobby.id === factory.lobbyJoinedId) {
          factory.getLobbyJoined().players = lobby.players;
          factory.getLobbyJoined().maxPlayers = lobby.maxPlayers;
        }
      });
      $rootScope.$emit('lobby-joined-updated');
    });

    Websocket.onJSON('lobbyData', function(newLobby) {
      factory.lobbyData[newLobby.id] = newLobby;

      if (newLobby.id === factory.lobbySpectatedId) {
        $rootScope.$emit('lobby-spectated-updated');
      }

      if (newLobby.id === factory.lobbyJoinedId) {
        $rootScope.$emit('lobby-joined-updated');
      }
    });

    Websocket.onJSON('lobbyJoined', function(data) {
      factory.lobbyJoinedId = data.id;
      factory.lobbyData[data.id] = data;
      $rootScope.$emit('lobby-joined');
      $rootScope.$emit('lobby-joined-updated');
    });

    Websocket.onJSON('lobbyLeft', function(data) {
      factory.lobbyJoinedId = -1;
      factory.lobbyJoinInformation = {};
      $rootScope.$emit('lobby-joined-updated');
      $rootScope.$emit('lobby-left');
    });

    Websocket.onJSON('lobbyClosed', function(data) {
      Notifications.toast({message: 'The lobby was closed'});
      $rootScope.$emit('lobby-closed');
    });

    return factory;
  }

})();
