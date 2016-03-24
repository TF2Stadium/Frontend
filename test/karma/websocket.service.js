/*global describe,beforeEach,it,sinon,expect,inject,afterEach */

import WebSocketModule from '../../src/app/shared/websocket.factory.js';

describe('Service: Websocket', function () {
  var Websocket;
  var $rootScope;
  var $timeout;
  var mockNotifications;

  var mockConfig = {
    'endpoints': {
      'websocket': 'ws://api.tf2stadium.gcommer.com/websocket/',
      'api': 'http://api.tf2stadium.gcommer.com'
    }
  };

  var stubSocket;
  var mockConnection;

  beforeEach(function () {
    mockNotifications = sinon.stub({
      toast: function () {}
    });

    mockConnection = sinon.stub({
      connect: function () {},
      On: function () {},
      Emit: function () {}
    });

    stubSocket = sinon.spy(function () {
      return mockConnection;
    });
    WebSocketModule.__Rewire__('Socket', stubSocket);

    angular.mock.module('tf2stadium.services', function ($provide) {
      $provide.value('Notifications', mockNotifications);
      $provide.constant('Config',  mockConfig);
    });

    inject(function (_Websocket_, _$rootScope_, _$timeout_) {
      $timeout = _$timeout_;
      $rootScope = _$rootScope_;
      Websocket = _Websocket_;
    });
  });

  afterEach(function () {
    WebSocketModule.__ResetDependency__('Socket');
  });

  it('should only construct one socket', function () {
    expect(stubSocket).to.be.calledOnce;
    expect(stubSocket).to.be.calledWithNew;
    expect(mockConnection.connect).to.not.be.called;
  });

  it('should open a socket to the configured endpoint with retries disabled', function () {
    expect(stubSocket).to.have.been.calledWith(
      mockConfig.endpoints.websocket,
      sinon.match({ maxRetries: 0 })
    );
  });

  describe('Socket events', function () {
    beforeEach(function () {
      sinon.stub($rootScope, '$emit');
    });

    afterEach(function () {
      $rootScope.$emit.restore();
    });

    it('should emit socket-opened when the socket connects', function () {
      mockConnection.onopen();
      $timeout.flush();
      expect($rootScope.$emit).to.be.calledOnce;
      expect($rootScope.$emit).to.be.calledWith('socket-opened');
    });

    it('should emit socket-close when the socket closes', function () {
      mockConnection.onclose();
      $timeout.flush();
      expect($rootScope.$emit).to.be.calledOnce;
      expect($rootScope.$emit).to.be.calledWith('socket-closed');
    });
  });

  describe('Reconnect toast', function () {
    beforeEach(function () {
      mockConnection.onclose();
    });

    it('should be made when the socket closes', function () {
      expect(mockNotifications.toast).to.have.been.calledOnce;
      expect(mockNotifications.toast).to.have.been.calledWithMatch({
        error: true
      });
    });

    it('should allow the user to attempt to reconnect', function () {
      expect(mockNotifications.toast).to.have.been.calledOnce;

      // User clicks the button
      mockNotifications.toast.args[0][0].action();

      expect(mockConnection.connect).to.have.been.calledOnce;
    });

    it('should make another toast if the reconnect fails', function () {
      expect(mockNotifications.toast).to.have.been.calledOnce;

      // User clicks the button
      mockNotifications.toast.args[0][0].action();

      expect(mockConnection.connect).to.have.been.calledOnce;

      // The reconnect fails
      mockConnection.onclose();
      expect(mockNotifications.toast).to.have.been.calledTwice;
      expect(mockNotifications.toast.secondCall.args[0].error).to.be.ok;
    });

    it('should make a non-error toast if the reconnect works', function () {
      expect(mockNotifications.toast).to.have.been.calledOnce;

      // User clicks the button
      mockNotifications.toast.args[0][0].action();

      expect(mockConnection.connect).to.have.been.calledOnce;

      // The reconnect fails
      mockConnection.onopen();
      expect(mockNotifications.toast.secondCall.args[0].error).to.not.be.ok;
    });
  });

  describe('Message Sending', function () {
    beforeEach(function () {
      mockConnection.onopen();
    });

    it('should send messages', function () {
      var testName = 'test';
      var testData = { test: 'test' };
      Websocket.emitJSON(testName, testData);

      expect(mockConnection.Emit).to.be.calledOnce;
      expect(mockConnection.Emit).to.be.calledWithMatch({
        test: 'test',
        request: testName
      });
    });

    it('message callbacks should be triggered, and errors should trigger toasts', function () {
      var testName = 'test';
      var testData = { test: 'test' };

      var cb = sinon.spy();
      Websocket.emitJSON(testName, testData, cb);

      expect(mockConnection.Emit).to.be.calledOnce;
      expect(mockConnection.Emit).to.be.calledWithMatch({
        test: 'test',
        request: testName
      });

      var msg = {success: false, message: 'abc'};

      var websocketCb = mockConnection.Emit.getCall(0).args[1];
      expect(websocketCb).to.be.a.function;
      websocketCb(angular.toJson(msg));
      $timeout.flush();

      expect(cb).to.be.calledOnce;
      expect(cb).to.be.calledWith(msg);
    });
  });

  describe('extractor paramaeter to wsevent.js', function () {
    it('should pull out the request field', function () {
      expect(stubSocket).to.be.calledOnce;

      var opts = stubSocket.getCall(0).args[1];
      expect(opts).to.have.property('extractor');
      expect(opts.extractor).to.be.a.function;
      expect(opts.extractor({request: 123})).to.equal(123);
    });
  });

  describe('Message Receive Queueing', function () {
    it('Should queue up messages for unregistered handlers', function () {
      mockConnection.onmessage('e1', 1);
      mockConnection.onmessage('e1', 2);
      mockConnection.onmessage('e1', 3);

      var cb = sinon.spy();

      expect(cb).to.not.be.called;

      Websocket.onJSON('e1', cb);
      $timeout.flush();

      expect(cb).to.be.calledThrice;
      expect(cb.firstCall).to.be.calledWith(1);
      expect(cb.secondCall).to.be.calledWith(2);
      expect(cb.thirdCall).to.be.calledWith(3);

      expect(mockConnection.On).to.be.calledOnce;
      expect(mockConnection.On).to.be.calledWith('e1');
      var wsOnCb = mockConnection.On.getCall(0).args[1];
      expect(wsOnCb).to.be.a.function;
      wsOnCb(4);
      $timeout.flush();

      expect(cb.callCount).to.equal(4);
      expect(cb.getCall(3)).to.be.calledWith(4);
    });
  });

  describe('Message Events', function () {
    //TODO
  });
});
