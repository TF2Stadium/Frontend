/* @flow */
export function play(src: string, volume: number) {
  var sound = document.createElement('audio');
  sound.src = src;
  sound.volume = volume;
  sound.play();
}
