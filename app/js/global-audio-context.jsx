let audioContextObject = {};

function getAudioContext() {
  if (!audioContextObject.audioCtx) {
    audioContextObject.audioCtx = new (window.AudioContext || window.webkitAudioContext);
  }
  return audioContextObject.audioCtx;
}

export { getAudioContext }
