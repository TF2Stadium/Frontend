(function () {
  'use strict';

  angular.module('tf2stadium').constant('Config', {
    'endpoints': {
      'websocket': 'ws://localhost:8080/websocket/',
      'api': 'http://localhost:8080'
    },
    'debug': true,
    emotes: [{
      // Names that can be used in :emoteName: syntax
      names: ['smile', 'happy'],
      // (Optional) short character sequences that can be used other
      // than the double colon syntax
      shortcuts: [':)', '(:', '=)'],
      // Where to load the emote from. Can be a separate image file,
      // or (TODO) description of a spritesheet and CSS options.
      // image names are relative to assets/img/emotes/
      image: {
        type: 'img',
        src: 'smile.png'
      }
    },{
      names: ['frown', 'sad'],
      shortcuts: [':(', '):', '=('],
      image: {
        type: 'img',
        src: 'frown.png'
      }
    },{
      names: ['kappa'],
      shortcuts: [],
      image: {
        type: 'img',
        src: 'kappa.png'
      }
    },{
      names: ['kappaRoss'],
      shortcuts: [],
      image: {
        type: 'img',
        src: 'kappaRoss.png'
      }
    }]
  });

})();
