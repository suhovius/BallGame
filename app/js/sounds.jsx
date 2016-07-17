import AudioPlayer from './classes/audio-player';

export default {
  "sounds" : {
    "ballCollisionHit": new AudioPlayer("audio/sounds/269718__michorvath__ping-pong-ball-hit.wav", { gainCoefficient: 2}),
    "ballToBallCollisionHit": new AudioPlayer("audio/sounds/269718__michorvath__ping-pong-ball-hit.wav"),
    "scorePointHit": new AudioPlayer("audio/sounds/349282__adam-n__coin-on-coins-10.wav"),
    "breakableBrickHit": new AudioPlayer("audio/sounds/42902__freqman__glass-break-4.wav"),
    "lostInBlackHole": new AudioPlayer("audio/sounds/206138__robinhood76__04673-small-short-sucking-whoosh.wav"),
    "levelComplete": new AudioPlayer("audio/sounds/337049__shinephoenixstormcrow__320655-rhodesmas-level-up-01.mp3"),
    "musicSlow": new AudioPlayer("audio/music/211413__zagi2__metal-loop-2.wav"),
    "musicFast": new AudioPlayer("audio/music/173918__zagi2__metal-loop.wav"),
  },
  play(soundName, options = {}) {
    this.sounds[soundName].play(options);
  }
}
