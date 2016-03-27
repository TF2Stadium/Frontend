/*global describe,beforeEach,it,sinon,expect,inject */

describe('Service: User', function () {
  var User, $rootScope;
  var mockWebsocket, mockConfig, mock$window;

  var onJSONCallbacks = {};
  var emitJSONCallbacks = [];

  beforeEach(function () {
    mockWebsocket = {
      onJSON: sinon.spy(function (eventName, callback) {
        onJSONCallbacks[eventName] = callback;
      }),
      emitJSON: sinon.spy(function (name, data, callback) {
        emitJSONCallbacks.push(callback);
      }),
    };

    mock$window = sinon.stub({
      open: function () {},
    });

    mockConfig = {
      endpoints: {
        'api': '',
      },
    };

    angular.mock.module('tf2stadium.services', function ($provide) {
      $provide.value('Websocket', mockWebsocket);
      $provide.value('Config', mockConfig);
      $provide.value('$window', mock$window);
    });

    inject(function (_User_, _$rootScope_) {
      $rootScope = _$rootScope_;
      User = _User_;
    });
  });

  describe('init()', function () {
    it('Should register for a playerProfile message', function () {
      User.init();

      expect(mockWebsocket.onJSON).to.be.calledOnce;
      expect(mockWebsocket.onJSON).to.be.calledWith('playerProfile');
    });

    it('playerProfile messages should update rootScope', function () {
      User.init();

      var data = {a: 1, b: 2};
      onJSONCallbacks['playerProfile'](data);
      expect($rootScope).to.have.property('userProfile');
      expect($rootScope.userProfile).to.equal(data);
    });
  });

  describe('getProfile()', function () {
    it('should send a playerProfile request', function () {
      var steamid = '123';
      var cb = sinon.spy();

      User.getProfile(steamid, cb);

      expect(mockWebsocket.emitJSON).to.be.calledOnce;
      expect(mockWebsocket.emitJSON).to.be.calledWith(
        'playerProfile',
        sinon.match({ steamid: steamid })
      );

      var data = {a: 1, b: 2};
      var response = {
        success: true,
        data,
      };
      emitJSONCallbacks[0](response);

      expect(cb).to.be.calledOnce;
      expect(cb).to.be.calledWith(data);
    });
  });
});
