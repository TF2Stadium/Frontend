/*global describe,beforeEach,it,sinon,expect,module,inject */

describe('Service: LobbyService', function () {
  'use strict';

  var LobbyService, $rootScope, $q;
  var mockWebsocket, mockNotifications, mockSettings;
  var mock$state, mock$mdDialog, mock$window;

  var callbacks = {};

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

    inject(function (_LobbyService_, _$rootScope_, _$q_) {
      $q = _$q_;
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
    it('should build mumble url', function () {
      var mumbleInfo = {
        password: 'password',
        address: 'example.org:12345',
        channel: 'chan1'
      };

      var cleanedMumbleURL = 'mumble://unnamed:' +
            mumbleInfo.password + '@' +
            mumbleInfo.address + '/' + mumbleInfo.channel + '/';

      callbacks['lobbyStart']({ mumble: mumbleInfo });

      expect(LobbyService.getLobbyJoinInformation().mumbleUrl.split('?')[0]).
        to.equal(cleanedMumbleURL);
    });
  });
});
