describe('Service: ChatService', function () {
  function makeTestMessage() {
    // The chat service may mutate the received object, so use a
    // factory like this to make the tests are truly isolated
    return {
      id: 1,
      message: 'hi',
      room: 0,
      timestamp: 1449001384,
      player: {
        avatar: '',
        gameHours: 1201,
        lobbiesPlayed: 0,
        name: 'test',
        profileUrl: '',
        role: '',
        steamid: '123',
        tags: ['player']
      }
    };
  }

  var ChatService, $rootScope;
  var mockWebsocket, mockLobbyService;

  beforeEach(function () {
    mockWebsocket = sinon.stub({
      onJSON: function (name, callback) {},
      emitJSON: function (name, data, callback) {}
    });

    mockLobbyService = sinon.stub({
      getLobbySpectatedId: function () { return -1; },
      getLobbyJoinedId: function () { return -1; },
      getLobbyJoined: function () { return undefined; },
      getLobbySpectated: function () { return undefined; }
    });

    module('tf2stadium.services', function ($provide) {
      $provide.value('Websocket', mockWebsocket);
      $provide.value('LobbyService', mockLobbyService);
    });

    inject(function (_ChatService_, _$rootScope_) {
      $rootScope = _$rootScope_;
      ChatService = _ChatService_;
    });
  });

  it('should register for chatReceive messages', function () {
    expect(mockWebsocket.onJSON).to.have.been.calledWith('chatReceive');
  });

  it('should emit one chat-message event after each chatReceive', function () {
    sinon.stub($rootScope, '$emit');

    var onJSONcalls = mockWebsocket.onJSON.args;
    var onChatReceive = onJSONcalls.filter(function (args) {
      return args[0] === 'chatReceive';
    })[0][1];

    expect(onChatReceive).to.be.a('function');

    var msg = makeTestMessage();
    onChatReceive(msg);

    expect($rootScope.$emit).to.be.calledWith(
      'chat-message', sinon.match({ message: msg.message}));

    expect($rootScope.$emit).to.be.calledOnce;

    $rootScope.$emit.restore();
  });

  it('should log chat messages', function () {
    var onJSONcalls = mockWebsocket.onJSON.args;
    var onChatReceive = onJSONcalls.filter(function (args) {
      return args[0] === 'chatReceive';
    })[0][1];

    expect(onChatReceive).to.be.a('function');

    var msg = makeTestMessage();
    onChatReceive(msg);

    expect(ChatService.getRooms()[0].messages.length).to.equal(1);
    expect(ChatService.getRooms()[0].messages[0].message).to.equal(msg.message);
  });

  it('should log chat messages ordered by id', function () {
    var onJSONcalls = mockWebsocket.onJSON.args;
    var onChatReceive = onJSONcalls.filter(function (args) {
      return args[0] === 'chatReceive';
    })[0][1];

    expect(onChatReceive).to.be.a('function');

    var msg1 = makeTestMessage();
    msg1.id = 1;

    var msg2 = makeTestMessage();
    msg2.id = 2;

    var msg3 = makeTestMessage();
    msg3.id = 3;

    // Note the wrong order
    onChatReceive(msg3);
    onChatReceive(msg1);
    onChatReceive(msg2);

    expect(ChatService.getRooms()[0].messages.length).to.equal(3);
    expect(ChatService.getRooms()[0].messages[0].id).to.equal(msg1.id);
    expect(ChatService.getRooms()[0].messages[1].id).to.equal(msg2.id);
    expect(ChatService.getRooms()[0].messages[2].id).to.equal(msg3.id);
  });
});
