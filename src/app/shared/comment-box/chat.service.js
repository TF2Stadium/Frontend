/* @flow */
import xssFilters from 'xss-filters';

const requireJson = require.context('../../../assets/', false, /^.*\.json$/);

angular
  .module('tf2stadium.services')
  .factory('ChatService', ChatService);

function flatten(arrays) {
  return Array.prototype.concat.apply([], arrays);
}

// Takes a raw input string and makes it something safe to embed in
// a regular expression. This involves escaping all special regex
// characters.
function regexSafe(raw) {
  return raw.replace(/[\\\[\]\^\$\*\+\?\.\(\)\|\{\}]/g, c => '\\' + c);
}

//
// Regular Expression for URL validation
//
// Author: Diego Perini
// Updated: 2010/12/05
// License: MIT
//
// Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// the regular expression composed & commented
// could be easily tweaked for RFC compliance,
// it was expressly modified to fit & satisfy
// these test for an URL shortener:
//
//   http://mathiasbynens.be/demo/url-regex
//
// Notes on possible differences from a standard/generic validation:
//
// - utf-8 char class take in consideration the full Unicode range
// - TLDs have been made mandatory so single names like "localhost" fails
// - protocols have been restricted to ftp, http and https only as requested
var urlRegex = new RegExp(
  '^(\\s*)' + // EDIT: match leading whitespace
    // protocol identifier
    '(?:(?:https?|ftp)://)?' + // EDIT: made the scheme optional
    // user:pass authentication
    '(?:\\S+(?::\\S*)?@)?' +
    '(' + // EDIT from original regex: made this a capturing group
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broacast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host name
    '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
    // domain name
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
    // TLD identifier
    '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
    // TLD may end with dot
    '\\.?' +
    ')' +
    // port number
    '(?::\\d{2,5})?' +
    // resource path
    '(?:[/?#]\\S*)?' +
    '$',
  'i'
);

function makeEmotesTransformer(emotesConfig) {
  var replacements =
        sortDescendingPriority(
          flatten(
            emotesConfig.map(emoteDescriptorToReplacer)));

  return function emotesToHTML_impl(str) {
    return replacements.reduce((s, replaceFn) => replaceFn(s), str);
  };

  function emoteDescriptorToHTML(desc) {
    var imgDesc = desc.image;

    if (imgDesc.type === 'img') {
      return `
        <img class="emote" src="assets/img/emotes/${imgDesc.src}"
             height="16" width="16" alt="${desc.names[0]}"
             title="${desc.names[0]}" />
        <emote type="${imgDesc.src}" />`;
    }
    // TODO: other emote image sources (spritesheets, ...)

    return '';
  }

  function setPriority(x, f) {
    f.priority = x;
    return f;
  }

  function sortDescendingPriority(arr) {
    return arr.sort((a, b) => b.priority - a.priority);
  }

  function makeColonReplacer(imgHTML, name) {
    var regexpr = new RegExp('(\\s|^):' + regexSafe(name) + ':(\\s|$)', 'g');
    return setPriority(name.length, str =>
                       str.replace(regexpr, (matched, leadingWhitespace) =>
                                   leadingWhitespace + imgHTML));
  }

  function makeShortcutReplacer(imgHTML, name) {
    var regexpr = new RegExp('(\\s|^)' + regexSafe(name) + '(?=\\s|$)', 'g');
    return setPriority(name.length, str =>
                       str.replace(regexpr, (matched, leadingWhitespace) =>
                                   leadingWhitespace + imgHTML));
  }

  // Takes a emote descriptor (see app.config.js.template)
  function emoteDescriptorToReplacer(desc) {
    var imgHTML = emoteDescriptorToHTML(desc);

    var colons = angular.isArray(desc.names) ? desc.names : [];
    colons = colons.map(makeColonReplacer.bind(null, imgHTML));

    var shortcuts = angular.isArray(desc.shortcuts) ? desc.shortcuts : [];
    shortcuts = shortcuts.map(makeShortcutReplacer.bind(null, imgHTML));

    return colons.concat(shortcuts);
  }
}

/** @ngInject */
function ChatService($rootScope, $sce, $log: AngularJSLog, $http, $q,
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
    this.id = angular.isDefined(id) ? id : -1;
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

  var urlWhitelist = Config.allowedChatDomains || [];

  function linkifyHTML(html) {
    // split on whitespace, but leave the whitespace at the front of
    // each word
    var words = html.split(/(?=\s)/);

    return words.map(function (w) {
      var url = urlRegex.exec(w);
      if (url) {
        var leadingWhitespace = url[1];

        var href = url[0].trim();
        if (href.indexOf('http') !== 0) {
          href = 'http://' + href;
        }

        // Whitelist check based on the domain name + TLD; ignore
        // sub domains
        var domain = url[2].split('.').splice(-2).join('.');

        if (urlWhitelist.indexOf(domain) !== -1) {
          return leadingWhitespace +
            '<a href="' + encodeURI(href) + '" target="_blank">' + w + '</a>';
        }
      }

      return w;
    }).join('');
  }

  // takes a string and replaces emotes strings with appropriate
  // HTML elements
  var emotesToHTML = makeEmotesTransformer([]);

  function trustEmotesAsHTML(s) {
    return $sce.trustAsHtml(linkifyHTML(emotesToHTML(s)));
  }

  function reapplyEmotes() {
    Object.keys(chatRoomLogs).map((roomId) => {
      chatRoomLogs[roomId].forEach((m) => {
        m.message = trustEmotesAsHTML(m.rawMessage);
      });
    });
  }

  var loadedStyle = null;
  function loadSettings(settings) {
    var promise;

    if (settings.emoteStyle !== loadedStyle) {
      loadedStyle = settings.emoteStyle;
      if (settings.emoteStyle === 'none') {
        promise = $q.when({data: []});
      } else {
        promise = $q.when({data: requireJson('./' + settings.emoteStyle + '.json')});
      }

      promise.then(function (data) {
        emotesToHTML = makeEmotesTransformer(data.data);
        reapplyEmotes();
      });
    }
  }

  Settings.getSettings(loadSettings);

  /* the angular/on-watch warning doesn't apply to services */
  /* eslint-disable angular/on-watch */
  $rootScope.$on('settings-updated', () => {
    Settings.getSettings(loadSettings);
  });


  var factory = {};
  factory.getRooms = function () {
    return rooms;
  };

  factory.send = function (message, room) {
    Websocket.emitJSON('chatSend', { message, room });
  };

  factory.deleteMessage = function (messageID, room) {
    var payload = {
      'id': messageID,
      'room': room,
    };

    Websocket.emitJSON('chatDelete', payload);
  };

  $rootScope.$on('lobby-joined', function () {
    joinedChatRoom.changeRoom(LobbyService.getLobbyJoinedId());
  });

  $rootScope.$on('lobby-left', () => joinedChatRoom.leave() );

  $rootScope.$on('lobby-spectated-changed', function () {
    spectatedChatRoom.changeRoom(LobbyService.getLobbySpectatedId());
  });

  function receiveMessage(message, noEvent) {
    var msg = xssFilters.inHTMLData(message.message);

    message.rawMessage = msg;
    message.message = trustEmotesAsHTML(msg);

    message.timestamp = new Date(message.timestamp);

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
        // Same message id: Overwrite the logged message
        log[insertIdx] = message;
      } else {
        // else insert it into the array (yeah, splice is far from
        // efficient, but this should be very rare).
        log.splice(insertIdx, 0, message);
      }
    }

    // Don't let the log grow too large, or render performance
    // tanks. There are better solutions to this perf issue, but
    // this is quick to implement for now.
    var maxLogSize = 80;
    if (log.length > maxLogSize) {
      log.splice(0, log.length - maxLogSize);
    }

    if (!$rootScope.userProfile ||
        (message.player &&
         message.player.steamid &&
         $rootScope.userProfile.steamid !== message.player.steamid)) {
      Notifications.titleNotification();
    }

    if (!noEvent) {
      $rootScope.$emit('chat-message', message);
    }
  }

  Websocket.onJSON('chatReceive', receiveMessage, true);

  Websocket.onJSON('chatScrollback', function (messages) {
    messages.forEach(function (msg) {
      receiveMessage(msg);
    });
  }, true);

  Websocket.onJSON('chatHistoryClear', function (data) {
    // Note: ChatRooms may have pointers to the arrays in
    // chatRoomLogs, so we have to mutate the actual logs rather
    // than just assign a new empty array.
    getChatRoom(data.room).length = 0;
  });

  return factory;
}
