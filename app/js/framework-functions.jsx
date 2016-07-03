import { GAME_AREA_BORDER } from './constants';

import { circleCollide } from './collision-detection';
import { distanceBettweenToPoints, angleBetween2Lines } from './math-utils';

function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updatePlayerCursor(player, inputStates) {
  // The player is just a circle, drawn at the mouse position
  // Just to test circle/circle collision.

  if(inputStates.mousePos) {
    player.x = inputStates.mousePos.x;
    player.y = inputStates.mousePos.y;

     // draws a circle
    // ctx.beginPath();
    // ctx.arc(player.x, player.y, player.boundingCircleRadius, 0, 2*Math.PI);
    // ctx.stroke();
  }
}

function updateGates(gatesArray) {
  for (var i = 0; i < gatesArray.length; i++) {
    gatesArray[i].draw();
  }
}

function updateBlackHoles(blackHolesArray, delta) {
  blackHolesArray = blackHolesArray.filter(function(blackHole) { return !blackHole.isDisappeared(); })
  for (var i = 0; i < blackHolesArray.length; i++) {
    if (blackHolesArray[i].isCollapsing()) {
      blackHolesArray[i].collapse(delta)
    }
    blackHolesArray[i].draw(delta);
  }

  return blackHolesArray;
}

function drawGameAreaBorder(ctx, canvas) {
  let w = canvas.width, h = canvas.height;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, w, GAME_AREA_BORDER);
  ctx.rect(0, h-GAME_AREA_BORDER, w, GAME_AREA_BORDER);
  ctx.rect(0, GAME_AREA_BORDER, GAME_AREA_BORDER, h-2*GAME_AREA_BORDER);
  ctx.rect(w-GAME_AREA_BORDER, GAME_AREA_BORDER, w-GAME_AREA_BORDER, h-2*GAME_AREA_BORDER);
  ctx.fillStyle = "#707070";
  ctx.fill();
  ctx.strokeStyle = "#383838";
  ctx.rect(GAME_AREA_BORDER,GAME_AREA_BORDER,w - 2*GAME_AREA_BORDER,h - 2*GAME_AREA_BORDER);
  ctx.stroke();
  ctx.restore();
}


function checkBallControllable(ballArray, player, inputStates, powerBoost, ctx) {
  for (var i = 0; i < ballArray.length; i++) {
    var ball = ballArray[i];

    if (circleCollide(player.x, player.y, player.boundingCircleRadius, ball.x, ball.y, ball.radius)) {
      ball.drawSelection();
    }

    if (ball.isInLaunchPosition() && inputStates.mouseDownPos && circleCollide(inputStates.mouseDownPos.x, inputStates.mouseDownPos.y, player.boundingCircleRadius, ball.x, ball.y, ball.radius)) {
      ball.drawSelection();

      if(inputStates.mousedown) {

        var powerInit = distanceBettweenToPoints(ball.x, ball.y, inputStates.mousePos.x, inputStates.mousePos.y);
        if (powerInit > 100) {
          powerInit = 100;
        }
        var angle = angleBetween2Lines(ball.x, ball.y, inputStates.mousePos.x, inputStates.mousePos.y, ball.x, ball.y, ball.x + 25, ball.y);

        ball.newParams = {
          angle: Math.PI + angle,
          v: powerInit * powerBoost,
          isSet: true
        };

        ctx.save();
        ctx.fillStyle = "#33CC33";
        ctx.fillText("Angle: " + ((2*Math.PI - (Math.PI + angle)) * (180/ Math.PI)).toFixed(2), 470, 30);
        ctx.fillText("Speed: " + ball.newParams.v.toFixed(2), 470, 55);
        ctx.fillText("Power: " + powerInit.toFixed(2), 470, 80);
        ctx.beginPath();
        ctx.strokeStyle = 'LightGreen';
        ctx.lineWidth = 3;
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(ball.x + powerInit * Math.cos(2*Math.PI+angle), ball.y + powerInit * Math.sin(2*Math.PI+angle));
        ctx.lineTo(ball.x - 500 * Math.cos(2*Math.PI+angle), ball.y - 500 * Math.sin(2*Math.PI+angle));
        // ctx.lineTo(inputStates.mousePos.x, inputStates.mousePos.y);
        ctx.stroke();
        // ctx.beginPath();
        // ctx.strokeStyle = 'BlueViolet';
        // ctx.fillStyle = 'BlueViolet';
        // ctx.moveTo(ball.x, 0);
        // ctx.lineTo(ball.x, h);
        // ctx.stroke();
        // ctx.moveTo(0, ball.y);
        // ctx.lineTo(w, ball.y);
        // ctx.stroke();
        // ctx.fillText("0", w-25, ball.y+25);
        // ctx.fillText("90", ball.x-30, h-25);
        // ctx.fillText("180", 25, ball.y-25);
        // ctx.fillText("270", ball.x+25, 50);
        // ctx.fillStyle = 'Black';

        ctx.restore();
      }
    }

    if (ball.newParams.isSet && !inputStates.mousedown) {
      ball.angle  = ball.newParams.angle;
      ball.v = ball.newParams.v;
      ball.newParams.isSet = false;
    }

  }
}

export { clearCanvas, updatePlayerCursor, updateGates, drawGameAreaBorder, checkBallControllable, updateBlackHoles }
