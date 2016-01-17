(function () {
  'use strict';

  angular.module('tf2stadium.services')
    .factory('ChatService', ChatService);

  function flatten(arrays) {
    return Array.prototype.concat.apply([], arrays);
  }

  // Takes a raw input string and makes it something safe to embed in
  // a regular expression. This involves escaping all special regex
  // characters.
  function regexSafe(raw) {
    return raw.replace(/[\\\[\]\^\$\*\+\?\.\(\)\|\{\}]/g,
                       function (c) { return '\\' + c; });
  }

  function makeEmotesTransformer(emotesConfig) {
    var replacements =
          sortDescendingPriority(
            flatten(
              emotesConfig.map(emoteDescriptorToReplacer)));

    return function emotesToHTML_impl(str) {
      return replacements.reduce(function (s, replaceFn) {
        return replaceFn(s);
      }, str);
    };

    function emoteDescriptorToHTML(desc) {
      var imgDesc = desc.image;

      if (imgDesc.type === 'img') {
        return '<img class="emote" src="assets/img/emotes/' + imgDesc.src +
          '" height="16" width="16"' +
          ' alt="' + desc.names[0] +'" title="' + desc.names[0] + '" />' +
          '<emote type="' + imgDesc.src + '"/>';
      }
      // TODO: other emote image sources (spritesheets, ...)

      return '';
    }

    function setPriority(x, f) {
      f.priority = x;
      return f;
    }

    function sortDescendingPriority(arr) {
      return arr.sort(function (a, b) {
        return a.priority < b.priority;
      });
    }

    function makeColonReplacer(imgHTML, name) {
      var regexpr = new RegExp(':' + regexSafe(name) + ':', 'g');
      return setPriority(name.length, function (str) {
        return str.replace(regexpr, imgHTML);
      });
    }

    function makeShortcutReplacer(imgHTML, name) {
      var regexpr = new RegExp(regexSafe(name), 'g');
      return setPriority(name.length,function (str) {
        return str.replace(regexpr, imgHTML);
      });
    }

    // Takes a emote descriptor (see app.config.js.template)
    function emoteDescriptorToReplacer(desc) {
      var imgHTML = emoteDescriptorToHTML(desc);

      var colons = angular.isArray(desc.names)? desc.names : [];
      colons = colons.map(makeColonReplacer.bind(null, imgHTML));

      var shortcuts = angular.isArray(desc.shortcuts)? desc.shortcuts : [];
      shortcuts = shortcuts.map(makeShortcutReplacer.bind(null, imgHTML));

      return colons.concat(shortcuts);
    }
  }

  /** @ngInject */
  function ChatService($rootScope, $sce, $log, $http, $q,
                       Websocket, LobbyService, Config,
                       Notifications, Settings) {
    // Persistent map of room id -> messages list
    var chatRoomLogs = Object.create(null);
    function getChatRoom(id) {
      if (angular.isUndefined(chatRoomLogs[id])) {
        chatRoomLogs[id] = [];
      }
      return chatRoomLogs[id];
    }

    function ChatRoom(id) {
      this.changeRoom(angular.isDefined(id)? id : -1);
    }

    ChatRoom.prototype.changeRoom = function chageRoom(id) {
      if (id !== this.id) {
        this.id = id;
        this.messages = getChatRoom(id);
      }
    };

    ChatRoom.prototype.leave = function leave() {
      this.changeRoom(-1);
    };

    var globalChatRoom = new ChatRoom(0);

    var spectatedChatRoom = new ChatRoom(LobbyService.getLobbySpectatedId());
    var joinedChatRoom = new ChatRoom(LobbyService.getLobbyJoinedId());

    joinedChatRoom.joined = true;

    var rooms = [globalChatRoom, joinedChatRoom, spectatedChatRoom];


    // takes a string and replaces emotes strings with appropriate
    // HTML elements
    var emotesToHTML = makeEmotesTransformer([]);

    function trustEmotesAsHTML(s) {
      return $sce.trustAsHtml(emotesToHTML(s));
    }

    function reapplyEmotes() {
      Object.keys(chatRoomLogs).map(function (roomId) {
        chatRoomLogs[roomId].forEach(function (m) {
          m.message = trustEmotesAsHTML(m.rawMessage);
        });
      });
    }

    function loadSettings(settings) {
      var promise;

      if (settings.emoteStyle === 'none') {
        promise = $q.when({data: []});
      } else {
        promise = $http.get('/assets/' + settings.emoteStyle + '.json');
      }

      promise.then(function (data) {
        emotesToHTML = makeEmotesTransformer(data.data);
        reapplyEmotes();
      });
    }

    Settings.getSettings(loadSettings);

    /* the angular/on-watch warning doesn't apply to services */
    /*eslint-disable angular/on-watch */
    $rootScope.$on('settings-updated', function () {
      Settings.getSettings(loadSettings);
    });


    var factory = {};
    factory.getRooms = function () {
      return rooms;
    };

    factory.send = function (message, room) {
      Websocket.emitJSON('chatSend', {
        message: message,
        room: room
      });
    };

    $rootScope.$on('lobby-joined', function () {
      joinedChatRoom.changeRoom(LobbyService.getLobbyJoinedId());
    });

    $rootScope.$on('lobby-left', function () {
      joinedChatRoom.leave();
    });

    $rootScope.$on('lobby-spectated-changed', function () {
      spectatedChatRoom.changeRoom(LobbyService.getLobbySpectatedId());
    });

    Websocket.onJSON('chatReceive', function (message) {
      var msg = xssFilters.inHTMLData(message.message);

      message.rawMessage = msg;
      message.message = trustEmotesAsHTML(msg);

      message.timestamp = new Date(message.timestamp * 1000);

      var log = getChatRoom(message.room);

      // Insert messages in sorted order (sorted by message id)
      if (log.length === 0 || log[log.length - 1].id < message.id) {
        log.push(message);
      } else {
        // performance likely isn't an issue, but since the log is
        // sorted by id, it would be better to use a binary search
        // here (also, use ES6 findIndex when available).
        var insertIdx = 0;
        while (log[insertIdx].id < message.id) {
          insertIdx++;
        }
        if (log[insertIdx].id === message.id) {
          // Same message id? Overwrite the logged message
          log[insertIdx] = message;
        } else {
          // else insert it into the array (yeah, splice is far from
          // efficient, but this should be very rare).
          log.splice(insertIdx, 0, message);
        }
      }

      Notifications.titleNotification();
      $rootScope.$emit('chat-message', message);
    });

    Websocket.onJSON('chatHistoryClear', function (data) {
      // Note: ChatRooms may have pointers to the arrays in
      // chatRoomLogs, so we have to mutate the actual logs rather
      // than just assign a new empty array.
      getChatRoom(data.room).length = 0;
    });

    return factory;
  }
})();
