var DebugUtils = function(ctx, w, h) {
    var drawAxis = function(x, y, theta, r) {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'Orange';
      ctx.fillStyle = 'Orange';
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.fillText("0", w-25, y+25);
      ctx.fillText("90", x-30, h-25);
      ctx.fillText("180", 25, y-25);
      ctx.fillText("270", x+25, 50);

      ctx.beginPath();
      ctx.strokeStyle = 'Red';
      ctx.moveTo(x, y);
      ctx.lineTo(x + r * Math.cos(theta), y + r * Math.sin(theta));
      ctx.stroke();

      ctx.restore();
    };

    return {
      drawAxis: drawAxis
    };
};
