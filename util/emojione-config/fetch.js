#!/usr/bin/env node

var https = require('https');

const URL = 'https://raw.githubusercontent.com/Ranks/emojione/master/emoji.json';

https.get(URL)
  .on('response', function handle(response) {
    var msg = '';
    response.setEncoding('utf8');

    response.on('data', (chunk) => {msg += chunk;});
    response.on('end', () => writeConfig(JSON.parse(msg)));
  });

// :abc: -> abc
function removeColons(str) {
  return str.substring(1, str.length - 1);
}

function writeConfig(rawEmojis) {
  var config = Object.keys(rawEmojis).filter(function (emojiName) {
    var emoji = rawEmojis[emojiName];
    return emoji.category === 'flags' || emoji.category === 'people';
  }).map(function (emojiName) {
    var emoji = rawEmojis[emojiName];

    return {
      names: emoji['aliases'].map(removeColons).concat(emojiName),
      shortcuts: emoji['aliases_ascii'],
      image: {
        type: 'img',
        src: 'emojione/' + emoji['unicode'] + '.png'
      }
    };
  });

  process.stdout.write(
    JSON.stringify(
      config.concat(require('./custom_emoji.js'))));
}
