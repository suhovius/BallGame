var MathUtils = (function() {

  var distanceBettweenToPoints = function(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
  }

  var angleBetween2Lines = function(x1, y1, x2, y2, x3, y3, x4, y4) {
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
  function dotLineLength(x, y, x0, y0, x1, y1, o){
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
  };

  return {
    distanceBettweenToPoints: distanceBettweenToPoints,
    angleBetween2Lines: angleBetween2Lines,
    dotLineLength: dotLineLength
  };

})();