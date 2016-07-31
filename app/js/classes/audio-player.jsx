import { getAudioContext } from '../global-audio-context';

export default class AudioPlayer {

  constructor(url, options={}) {
    this.url = url;

    this.gainCoefficient = options["gainCoefficient"] || 1;

    this.loop = options["loop"] || false;

    this._loadBuffer();

    this.status = "stopped";

  }

  isLoaded() {
    return this.buffer instanceof AudioBuffer;
  }

  play(options={}) {
    if (this.isLoaded()) {
      this._playSound(options);
    } else {
      this.waitToPlayWithOptions = options;
    }
    this.status = "playing";
  }

  stop() {
    if (this.isLoaded) {
      this.sourceNode && this.sourceNode.stop();
    }
    this.status = "stopped";
  }

  _playSound(options={}) {
    // build graph source -> gain -> compressor -> speakers
    let sourceNode = getAudioContext().createBufferSource();
    this.sourceNode = sourceNode;
    sourceNode.loop = this.loop;
    let compressorNode = getAudioContext().createDynamicsCompressor();
    let gainNode = getAudioContext().createGain();

    let gain = 1;
    if (typeof options["gain"] != 'undefined') {
      gain = options["gain"];
    }

    gainNode.gain.value = gain * this.gainCoefficient;

    sourceNode.buffer = this.buffer;
    sourceNode.connect(gainNode);
    gainNode.connect(compressorNode);
    compressorNode.connect(getAudioContext().destination);

    sourceNode.start();
  }

  _loadBuffer() {
    // Load buffer asynchronously
    console.log('file : ' + this.url + " loading and decoding");

    let request = new XMLHttpRequest();
    request.open("GET", this.url, true);

    request.responseType = "arraybuffer";

    let audioPlayer = this;

    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      getAudioContext().decodeAudioData(
        request.response,
        function(buffer) {
          console.log("Loaded and decoded track " + audioPlayer.url);
          if (!buffer) {
            console.error('error decoding file data: ' + audioPlayer.url);
            return;
          }

          audioPlayer.buffer = buffer;
          if (audioPlayer.waitToPlayWithOptions) {
            audioPlayer._playSound(audioPlayer.waitToPlayWithOptions);
          }
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    };

    request.onprogress = function(e) {
      if (e.total !== 0) {
        var percent = (e.loaded * 100) / e.total;
        console.log("loaded " + percent  + " % of file ");
      }
    };

    request.onerror = function() {
      console.error('BufferLoader: XHR error');
    };

    request.send();
  }

};
