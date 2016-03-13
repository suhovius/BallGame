var DebugUtils = (function() {
    var drawAxis = function(ctx, w, h, x, y, theta, r) {
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

    var updateTelemetry = function (telemetryContainer, ball) {
      telemetryContainer.innerHTML = "";
      telemetryContainer.innerHTML += '<br/>Initial Speed: ' + ball.v;
      telemetryContainer.innerHTML += '<br/>Initial Angle: ' + ball.angle * (180/ Math.PI);
      telemetryContainer.innerHTML += '<br/>Current Speed: ' + ball.currentVelocity();
      telemetryContainer.innerHTML += '<br/>Current Angle: ' + ball.currentAngle() * (180/ Math.PI);
      telemetryContainer.innerHTML += '<br/>Coordiates: X = ' + ball.x + " Y = " + ball.y;
      telemetryContainer.innerHTML += '<br/>Hit angle: ' + ball.hitAngle * (180/ Math.PI) + ' Positive: ' + (ball.hitAngle > 0 ? ball.hitAngle : ball.hitAngle + 2*Math.PI) * (180/ Math.PI);
      telemetryContainer.innerHTML += '<br/>Hit velocity: ' + ball.hitVelocity;
      telemetryContainer.innerHTML += '<br/>vX: ' + ball.vX();
      telemetryContainer.innerHTML += '<br/>vY: ' + ball.vY();

      // var anglesStr = "";
      // for(var i =0; i <= ball.hits.length - 1; i++ ) {
      //   if (true) {
      //     anglesStr += (Math.round(ball.hits[i].angleBetween * (180/ Math.PI)) + ' ');
      //   }
      // }
      // telemetryContainer.innerHTML += ('<br/> Hit angles: ' + anglesStr);
    }

    var drawCollisionAngles = function(ctx, w, h, ball) {
      ctx.save();
      for (var i = 0; i < ball.hits.length - 1; i++) {
          var hit = ball.hits[i];
          if (true) {
            ctx.beginPath();
            ctx.strokeStyle = 'LightGreen';
            ctx.lineWidth=2;
            ctx.fillText((Math.round(hit.angleBetween * (180/ Math.PI))), (hit.x +w/2) /2, (hit.y +h/2)/2 );
            ctx.moveTo(hit.x, hit.y);
            ctx.lineTo(w/2, h/2);
            ctx.stroke();
          }
      }
      ctx.restore();
    }

    return {
      drawAxis: drawAxis,
      updateTelemetry: updateTelemetry,
      drawCollisionAngles: drawCollisionAngles
    };
})();
