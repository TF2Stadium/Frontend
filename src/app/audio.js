/* @flow */
export function play(src, volume) {
  var sound = document.createElement('audio');
  sound.src = src;
  sound.volume = volume;
  sound.play();
}
