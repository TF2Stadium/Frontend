/*global describe,beforeEach,it,sinon,expect,module,inject */

describe('Service: LobbyService', function () {
  'use strict';

  var LobbyService, $rootScope, $timeout, $q;
  var mockWebsocket, mockNotifications, mockSettings;
  var mock$state, mock$mdDialog, mock$window;

  var callbacks = {};

  function startsWith(str, searchString) {
    return str.indexOf(searchString) === 0;
  }

  beforeEach(function () {
    mockWebsocket = {
      onJSON: sinon.spy(function (eventName, cb) {
        callbacks[eventName] = cb;
      }),
      emitJSON: sinon.spy(function () {
      })
    };

    mockNotifications = sinon.stub({
      toast: function () { },
      notifyBrowser: function () { }
    });

    mockSettings = sinon.stub({
      getSettings: function () {}
    });

    mock$state = sinon.stub({
      go: function () {}
    });

    mock$window = sinon.stub({
      open: function () {}
    });

    module('tf2stadium.services', function ($provide) {
      mock$mdDialog = {
        show: sinon.spy(function () { return $q.when({}); })
      };

      $provide.value('Websocket', mockWebsocket);
      $provide.value('Notifications', mockNotifications);
      $provide.value('Settings', mockSettings);
      $provide.value('$state', mock$state);
      $provide.value('$mdDialog', mock$mdDialog);
      $provide.value('$window', mock$window);
    });

    inject(function (_LobbyService_, _$rootScope_, _$timeout_, _$q_) {
      $q = _$q_;
      $timeout = _$timeout_;
      $rootScope = _$rootScope_;
      LobbyService = _LobbyService_;
    });
  });

  describe('goToLobby()', function () {
    it('should go to the given lobby id', function () {
      LobbyService.goToLobby(1);
      expect(mock$state.go).to.be.calledOnce;
      expect(mock$state.go).to.be.calledWith(
        'lobby-page',
        sinon.match.has('lobbyID', 1)
      );
    });
  });

  describe('lobby ready up', function () {
    it('should emit a lobby-ready-up event', function () {
      sinon.stub($rootScope, '$emit');

      callbacks['lobbyReadyUp']();
      expect($rootScope.$emit).to.be.calledOnce;
      expect($rootScope.$emit).to.be.calledWith('lobby-ready-up');

      $rootScope.$emit.restore();
    });
  });

  describe('mumble', function () {
    it('should clean mumble names', function () {
      var mumbleInfo = {
        nick: 'name with multiple  spaces',
        password: 'password',
        address: 'example.org:12345'
      };

      var cleanedMumbleURL = 'mumble://' +
            mumbleInfo.nick.replace(/ +/g, '_') + ':' +
            mumbleInfo.password + '@' +
            mumbleInfo.address + '/';

      callbacks['lobbyStart']({ mumble: mumbleInfo });

      expect(LobbyService.getLobbyJoinInformation().mumbleUrl.split('?')[0]).
        to.equal(cleanedMumbleURL);
    });

    it('should not remove accents', function () {
      var mumbleInfo = {
        nick: 'Ññáéíóúü',
        password: 'password',
        address: 'example.org:12345'
      };

      var cleanedMumbleURL = 'mumble://' +
            mumbleInfo.nick + ':' +
            mumbleInfo.password + '@' +
            mumbleInfo.address + '/';

      callbacks['lobbyStart']({ mumble: mumbleInfo });

      expect(LobbyService.getLobbyJoinInformation().mumbleUrl.split('?')[0]).
        to.equal(cleanedMumbleURL);
    });
  });
});
