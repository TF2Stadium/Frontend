/*global describe,beforeEach,it,sinon,expect,module,inject */

describe('Service: ChatService', function () {
  'use strict';

  function makeTestPlayer(p) {
    return {
      avatar: '',
      gameHours: 1201 + p*100,
      lobbiesPlayed: 0,
      name: 'player' + p,
      profileUrl: '',
      role: '',
      steamid: '' + p,
      tags: ['player']
    };
  }

  function makeTestMessage(n, p) {
    // n is a way to order messages,
    // p lets us test multiple players
    // The chat service may mutate the received object, so use a
    // factory like this to make the tests are truly isolated
    if (angular.isUndefined(n)) {
      n = 1;
    }
    if (angular.isUndefined(p)) {
      p = 1;
    }
    return {
      id: n,
      message: 'hi' + n,
      room: 0,
      timestamp: 1449001384 + n*1000,
      player: makeTestPlayer(p)
    };
  }

  var ChatService, $rootScope;
  var mockWebsocket, mockLobbyService, mockNotifications;

  var onJSONCallbacks = {};

  beforeEach(function () {
    mockWebsocket = {
      onJSON: sinon.spy(function (eventName, callback) {
        onJSONCallbacks[eventName] = callback;
      }),
      emitJSON: sinon.spy(function () {})
    };

    mockLobbyService = sinon.stub({
      getLobbySpectatedId: function () { return -1; },
      getLobbyJoinedId: function () { return -1; },
      getLobbyJoined: function () { return undefined; },
      getLobbySpectated: function () { return undefined; }
    });

    mockNotifications = sinon.stub({
      titleNotification: function () { return undefined; }
    });

    module('tf2stadium.services', function ($provide) {
      $provide.value('Websocket', mockWebsocket);
      $provide.value('LobbyService', mockLobbyService);
      $provide.value('Notifications', mockNotifications);
    });

    inject(function (_ChatService_, _$rootScope_) {
      $rootScope = _$rootScope_;
      ChatService = _ChatService_;
    });
  });

  it('should register for chatReceive messages', function () {
    expect(mockWebsocket.onJSON).to.have.been.calledWith('chatReceive');
  });

  it('should register for chatHistoryClear messages', function () {
    expect(mockWebsocket.onJSON).to.have.been.calledWith('chatHistoryClear');
  });

  it('should emit one chat-message event after each chatReceive', function () {
    sinon.stub($rootScope, '$emit');

    var onChatReceive = onJSONCallbacks['chatReceive'];

    expect(onChatReceive).to.be.a('function');

    var msg = makeTestMessage();
    onChatReceive(msg);

    expect($rootScope.$emit).to.be.calledWith(
      'chat-message', sinon.match({ message: msg.message}));

    expect($rootScope.$emit).to.be.calledOnce;

    $rootScope.$emit.restore();
  });

  it('should log chat messages', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];

    var msg = makeTestMessage();
    onChatReceive(msg);

    expect(ChatService.getRooms()[0].messages.length).to.equal(1);
    expect(ChatService.getRooms()[0].messages[0].message).to.equal(msg.message);
  });

  it('should log chat messages ordered by id', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];

    var msg1 = makeTestMessage(1);
    var msg2 = makeTestMessage(2);
    var msg3 = makeTestMessage(3);

    // Note the wrong order
    onChatReceive(msg3);
    onChatReceive(msg1);
    onChatReceive(msg2);

    expect(ChatService.getRooms()[0].messages.length).to.equal(3);
    expect(ChatService.getRooms()[0].messages[0].id).to.equal(msg1.id);
    expect(ChatService.getRooms()[0].messages[1].id).to.equal(msg2.id);
    expect(ChatService.getRooms()[0].messages[2].id).to.equal(msg3.id);
  });

  it('should clear a room\'s log on chatHistoryClear', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];
    var onChatHistoryClear = onJSONCallbacks['chatHistoryClear'];

    expect(onChatHistoryClear).to.be.a('function');

    var msg1 = makeTestMessage(1);
    var msg2 = makeTestMessage(2);
    var msg3 = makeTestMessage(3);

    onChatReceive(msg1);
    onChatReceive(msg2);
    onChatReceive(msg3);

    expect(ChatService.getRooms()[0].messages.length).to.equal(3);
    onChatHistoryClear({ room: msg1.room + 1 });
    expect(ChatService.getRooms()[0].messages.length).to.equal(3);
    onChatHistoryClear({ room: msg1.room });
    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
  });

  it('should overwrite messages with the same id in the same room', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];

    var msg1 = makeTestMessage(1);
    var msg2 = makeTestMessage(2);
    var msg3 = makeTestMessage(3);
    msg3.id = 1;

    onChatReceive(msg1);
    onChatReceive(msg2);
    expect(ChatService.getRooms()[0].messages.length).to.equal(2);
    onChatReceive(msg3);
    expect(ChatService.getRooms()[0].messages.length).to.equal(2);

    expect(ChatService.getRooms()[0].messages[0].message).to.equal(msg3.message);
  });

  it('should track joined chat rooms', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];

    var joinedRoomId = 5;
    mockLobbyService.getLobbyJoinedId.returns(joinedRoomId);
    $rootScope.$emit('lobby-joined');

    var msg = makeTestMessage(1);
    msg.room = joinedRoomId + 1;

    onChatReceive(msg);

    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
    expect(ChatService.getRooms()[1].messages.length).to.equal(0);

    var msg2 = makeTestMessage(2);
    msg2.room = joinedRoomId;

    onChatReceive(msg2);

    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
    expect(ChatService.getRooms()[1].messages.length).to.equal(1);
  });

  it('should track spectated chat rooms', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];

    var spectatedRoomId = 5;
    mockLobbyService.getLobbySpectatedId.returns(spectatedRoomId);
    $rootScope.$emit('lobby-spectated-changed');

    var msg = makeTestMessage(1);
    msg.room = spectatedRoomId + 1;

    onChatReceive(msg);

    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
    expect(ChatService.getRooms()[1].messages.length).to.equal(0);
    expect(ChatService.getRooms()[2].messages.length).to.equal(0);

    var msg2 = makeTestMessage(2);
    msg2.room = spectatedRoomId;

    onChatReceive(msg2);

    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
    expect(ChatService.getRooms()[1].messages.length).to.equal(0);
    expect(ChatService.getRooms()[2].messages.length).to.equal(1);
  });

  it('should leave and join chatrooms', function () {
    var onChatReceive = onJSONCallbacks['chatReceive'];

    var joinedRoomId = 1;
    mockLobbyService.getLobbyJoinedId.returns(joinedRoomId);
    $rootScope.$emit('lobby-joined');

    var msg = makeTestMessage(1);
    msg.room = joinedRoomId;

    onChatReceive(msg);

    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
    expect(ChatService.getRooms()[1].messages.length).to.equal(1);

    $rootScope.$emit('lobby-left');

    expect(ChatService.getRooms()[0].messages.length).to.equal(0);
    expect(ChatService.getRooms()[1].messages.length).to.equal(0);
  });

  it('should send chat messages to rooms', function () {
    var roomId = 123;
    var message = 'asdfasdf';

    ChatService.send(message, roomId);

    expect(mockWebsocket.emitJSON).to.be.calledOnce;
    expect(mockWebsocket.emitJSON).to.be.calledWith(
      'chatSend',
      sinon.match({
        message: message,
        room: roomId
      })
    );
  });
});
