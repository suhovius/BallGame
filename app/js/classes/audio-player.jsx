import { getAudioContext } from '../global-audio-context';

export default class AudioPlayer {

  constructor(url, options={}) {
    this.url = url;
    if (typeof options["gainCoefficient"] != 'undefined') {
      this.gainCoefficient = options["gainCoefficient"];
    } else {
      this.gainCoefficient = 1;
    }

    this._loadBuffer();
  }

  play(options={}) {
    if (this.buffer instanceof AudioBuffer) {
       // build graph source -> gain -> compressor -> speakers
       let sourceNode = getAudioContext().createBufferSource();
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
