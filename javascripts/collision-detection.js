var CollisionDetection = (function() {
   var circleCollide = function(x1, y1, r1, x2, y2, r2) {
      var dx = x1 - x2;
      var dy = y1 - y2;
      return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
    };

    return {
      circleCollide: circleCollide
    };
})();
