export default class AudioPlayer {

  constructor(url, options={}) {
    this.url = url;
    this.options = options;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext);
    this._loadBuffer();
  }

  play(options={}) {
    if (this.buffer instanceof AudioBuffer) {
       // build graph source -> gain -> compressor -> speakers
       let sourceNode = this.audioCtx.createBufferSource();
       let compressorNode = this.audioCtx.createDynamicsCompressor();
       let gainNode = this.audioCtx.createGain();

       if (typeof options["gain"] != 'undefined') {
         gainNode.gain.value = options["gain"];
       } else {
         gainNode.gain.value = 1;
       }

       sourceNode.buffer = this.buffer;
       sourceNode.connect(gainNode);
       gainNode.connect(compressorNode);
       compressorNode.connect(this.audioCtx.destination);
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
      audioPlayer.audioCtx.decodeAudioData(
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
