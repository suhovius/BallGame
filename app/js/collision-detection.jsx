import { dotLineLength } from './math-utils';


function circleCollide(x1, y1, r1, x2, y2, r2) {
  var dx = x1 - x2;
  var dy = y1 - y2;
  return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
}

function circRectsOverlap(x0, y0, w0, h0, cx, cy, r) {
  var testX = cx;
  var testY = cy;

  if (testX < x0)
      testX = x0;
  if (testX > (x0 + w0))
      testX = (x0 + w0);
  if (testY < y0)
      testY = y0;
  if (testY > (y0 + h0))
      testY = (y0 + h0);

  return (((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY)) < r * r);
}

function testCollisionWithWalls(w, h, gameAreaBorder, ball) {
  // left
  if (ball.x < (ball.radius + gameAreaBorder)) {
      ball.x = (ball.radius + gameAreaBorder);
      ball.collisionReset(Math.PI/2); // set current values like speed, angle, and reset run time to zero
      ball.angle = -ball.angle + Math.PI;

  }
  // right
  if (ball.x > (w - gameAreaBorder) - (ball.radius)) {
      ball.x = (w - gameAreaBorder) - (ball.radius);
      ball.collisionReset(Math.PI/2);
      ball.angle = -ball.angle + Math.PI;
  }
  // up
  if (ball.y < (ball.radius + gameAreaBorder)) {
      ball.y = (ball.radius + gameAreaBorder);
      ball.collisionReset(Math.PI);
      ball.angle = -ball.angle;
  }
  // down
  if (ball.y > (h - gameAreaBorder) - (ball.radius)) {
      ball.y = (h - gameAreaBorder) - (ball.radius);
      ball.collisionReset(Math.PI);
      ball.angle = -ball.angle;
  }
}

function ballBrickCollisionSides(ball, brick) {
  // TODO this logic should be changed. Use should use lengths from ball center to walls
  // and find closest pair of dots this will be collision side.
  // if there are among rest dots pair of non closest dots than there is side dot hit.
  var sides = [];

  var distances = {};
  var sideKeys = Object.keys(brick.coordinatesHash);
  for (var i in sideKeys) {
    distances[sideKeys[i]] = dotLineLength(ball.x, ball.y, brick.coordinatesHash[sideKeys[i]].x1, brick.coordinatesHash[sideKeys[i]].y1, brick.coordinatesHash[sideKeys[i]].x2, brick.coordinatesHash[sideKeys[i]].y2, true);
  }

  // console.log(distances);

  var distanceSideKeys = Object.keys(distances);
  var sortedDistanceSidesInAscendingOrder = distanceSideKeys.sort(function(a, b){return distances[a]-distances[b]});

  sides.push(sortedDistanceSidesInAscendingOrder[0]);
  // TODO: Find better coefficient for this
  if (Math.abs(distances[sortedDistanceSidesInAscendingOrder[0]] - distances[sortedDistanceSidesInAscendingOrder[1]]) < 0.5) {
    sides.push(sortedDistanceSidesInAscendingOrder[1]);
  }

  return sides;
}

function resetBallAfterBrickCollision(ball, brick) {
  // still this code needs fixes.
  // collision detection is not accurate enough
  var sides =  ballBrickCollisionSides(ball, brick);

  // console.log(sides);
  if (ball.v > 0) {
    brick.drawCollision(sides);
  }

  // 45 degree collision with brick's facet
  // if (sides.length == 2) {
  //   // var offset = ball.radius / Math.sqrt(2); // Pythagorean theorem https://en.wikipedia.org/wiki/Pythagorean_theorem
  //   // if (ball.v == 0) {
  //   //   offset = ball.radius;
  //   // }

  //   var offset = ball.radius;

  //   if ( (sides.indexOf("left") != -1) && (sides.indexOf("bottom") != -1) ) {
  //     ball.collisionReset(Math.PI/4);
  //     // ball.angle = 3*Math.PI/4;
  //     ball.angle = - ball.angle + Math.PI;
  //     ball.x = (brick.x - offset);
  //     ball.y = (brick.y + brick.height + offset);
  //     // console.log("left and bottom 45");
  //   }

  //   if ( (sides.indexOf("top") != -1) && (sides.indexOf("right") != -1) ) {
  //     ball.collisionReset(Math.PI/4);
  //     // ball.angle = 7*Math.PI/4;
  //     ball.angle = - ball.angle + Math.PI;
  //     ball.x = (brick.x + brick.width + offset);
  //     ball.y = (brick.y - offset);
  //     // console.log("top and right 45");
  //   }

  //   if ( (sides.indexOf("left") != -1) && (sides.indexOf("top") != -1) ) {
  //     ball.collisionReset(3*Math.PI/4);
  //     // ball.angle = 5*Math.PI/4;
  //     ball.angle = - ball.angle + Math.PI;
  //     ball.x = (brick.x - offset);
  //     ball.y = (brick.y - offset);
  //     // console.log("left and top 135");
  //   }

  //   if ( (sides.indexOf("right") != -1) && (sides.indexOf("bottom") != -1) ) {
  //     ball.collisionReset(3*Math.PI/4);
  //     // ball.angle = Math.PI/4;
  //     ball.angle = - ball.angle + Math.PI;
  //     ball.x = (brick.x + brick.width + offset);
  //     ball.y = (brick.y + brick.height + offset);
  //     // console.log("right and bottom 135");
  //   }

  // // brick side collisions
  // } else
  if (sides.indexOf("left") != -1) {
    ball.x = (brick.x - ball.radius);
    ball.collisionReset(Math.PI/2);
    ball.angle = -ball.angle + Math.PI;
    // console.log("left");
  } else if (sides.indexOf("right") != -1) {
    ball.x = (brick.x + brick.width + ball.radius);
    ball.collisionReset(Math.PI/2);
    ball.angle = -ball.angle + Math.PI;
    // console.log("right");
  } else if (sides.indexOf("bottom") != -1) {
    ball.y = (brick.y + brick.height + ball.radius);
    ball.collisionReset(Math.PI);
    ball.angle = -ball.angle;
    // console.log("bottom");
  } else if (sides.indexOf("top") != -1) {
    ball.y = (brick.y - ball.radius);
    ball.collisionReset(Math.PI);
    ball.angle = -ball.angle;
    // console.log("top");

    // When ball is slipping (rotating) from the edge
    if (ball.x < brick.coordinatesHash.top.x1) {
      ball.x = ball.x - 3;
    } else if (ball.x > brick.coordinatesHash.top.x2) {
      ball.x = ball.x + 3;
    }
  }

}

function testCollisionWithBricks(bricksArray, ball) {
  for (var i = 0; i < bricksArray.length; i ++) {
    if (circRectsOverlap(bricksArray[i].x, bricksArray[i].y, bricksArray[i].width, bricksArray[i].height, ball.x, ball.y, ball.radius)) {
      resetBallAfterBrickCollision(ball, bricksArray[i]);
    }
  }
}

export { circleCollide, circRectsOverlap, testCollisionWithWalls, resetBallAfterBrickCollision, testCollisionWithBricks }

