function findNewPointBy(x, y, angle, distance) {
  var result = {};

  result.x = Math.round(Math.cos(angle) * distance + x);
  result.y = Math.round(Math.sin(angle) * distance + y);

  return result;
}

function randomArrayValue(array) {
  return array[Math.floor(Math.random()*array.length)];
}

function distanceBettweenToPoints(x1, y1, x2, y2) {
  return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
}

function angleBetween2Lines(x1, y1, x2, y2, x3, y3, x4, y4) {
  return Math.atan2(y2 - y1, x2 - x1);
}

// http://jsfromhell.com/math/dot-line-length
// dotLineLength(x: Integer, y: Integer, x0: Integer, y0: Integer, x1: Integer, y1: Integer, [overLine: Boolean = False]): Double
// Distance from a point to a line or segment.
// x - point's x coord
// y - point's y coord
// x0 - x coord of the line's A point
// y0 - y coord of the line's A point
// x1 - x coord of the line's B point
// y1 - y coord of the line's B point
// overLine - specifies if the distance should respect the limits of the segment (overLine = true)
//            or if it should consider the segment as an infinite line (overLine = false),
//            if false returns the distance from the point to the line, otherwise the distance from
//            the point to the segment
function dotLineLength(x, y, x0, y0, x1, y1, o) {
  function lineLength(x, y, x0, y0){
      return Math.sqrt((x -= x0) * x + (y -= y0) * y);
  }
  if(o && !(o = function(x, y, x0, y0, x1, y1){
      if(!(x1 - x0)) return {x: x0, y: y};
      else if(!(y1 - y0)) return {x: x, y: y0};
      var left, tg = -1 / ((y1 - y0) / (x1 - x0));
      return {x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
  }(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))){
      var l1 = lineLength(x, y, x0, y0), l2 = lineLength(x, y, x1, y1);
      return l1 > l2 ? l2 : l1;
  }
  else {
      var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
      return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
  }
}

// We want the object to move at speed pixels/s (there are 60 frames in a second)
// If we are really running at 60 frames/s, the delay between frames should be 1/60
// = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
// longer, the formula works
function calcDistanceToMove(delta, speed) {
  //console.log("#delta = " + delta + " speed = " + speed);
  return (speed * delta) / 1000;
}

function moveFromToLocationOffsetsXY(fromX, fromY, toX, toY, speed) {
  let angle = Math.atan2(toY - fromY, toX - fromX);
  return [Math.cos(angle) * speed, Math.sin(angle) * speed];
}

function msToSeconds(timeMs) {
  return timeMs / 1000;
}

// Taken from here http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb/12342275#12342275
function hex2rgb(hex, opacity) {
  var h=hex.replace('#', '');
  h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

  for(var i=0; i<h.length; i++)
      h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

  if (typeof opacity != 'undefined')  h.push(opacity);

  return 'rgba('+h.join(',')+')';
}

// https://jsfiddle.net/xg7tek9j/7/
function generateUUID() {
  var d = new Date().getTime();
  if(window.performance && typeof window.performance.now === "function"){
      d += performance.now();; //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x3|0x8)).toString(16);
  });
  return uuid;
};


export { distanceBettweenToPoints, angleBetween2Lines, dotLineLength, calcDistanceToMove, msToSeconds, hex2rgb, moveFromToLocationOffsetsXY, generateUUID, findNewPointBy, randomArrayValue }
