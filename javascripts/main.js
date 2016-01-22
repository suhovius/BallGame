// Inits
window.onload = function init() {
  var game = new GF();
  game.start();
};


// GAME FRAMEWORK STARTS HERE
var GF = function(){
  // Vars relative to the canvas
  var canvas, ctx, w, h;

  // vars for counting frames/s, used by the measureFPS function
  var frameCount = 0;
  var lastTime;
  var fpsContainer;
  var telemetryContainer;
  var fps;
  // for time based animation
  var delta, oldTime = 0;

  // vars for handling inputs
  var inputStates = {};

  // array of balls to animate
  var ballArray = [];

  var player = {
    x:0,
    y:0,
    boundingCircleRadius: 5
  };

// Gravity
// 9.8 m/s2
// We use ms as time
// Suppose that 1 px is 1 mm than
// 1 m = 1000 mm
// 9.8 * 1000 mm / (1000 ms * 1000 ms)
// 9.8 * 1000 / ( 1000 * 1000 ) =0.0098 px/ms2
  var gravityAcceleration = 0.098;

  var currentBallParams = {};

  var msToSeconds = function(timeMs) {
    return timeMs / 1000;
  }

  // We want the object to move at speed pixels/s (there are 60 frames in a second)
    // If we are really running at 60 frames/s, the delay between frames should be 1/60
    // = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
    // longer, the formula works
  var calcDistanceToMove = function(delta, speed) {
    //console.log("#delta = " + delta + " speed = " + speed);
    return (speed * delta) / 1000;
  };

  var updateTelemetry = function (ball) {
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
  }

  var measureFPS = function(newTime){

    // test for the very first invocation
    if(lastTime === undefined) {
      lastTime = newTime;
      return;
    }

    //calculate the difference between last & current frame
    var diffTime = newTime - lastTime;

    if (diffTime >= 1000) {
      fps = frameCount;
      frameCount = 0;
      lastTime = newTime;
    }

    //and display it in an element we appended to the
    // document in the start() function
    fpsContainer.innerHTML = 'FPS: ' + fps;
    frameCount++;
  };

   // clears the canvas content
   function clearCanvas() {
     ctx.clearRect(0, 0, w, h);
   }

  function circleCollide(x1, y1, r1, x2, y2, r2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return ((dx * dx + dy * dy) < (r1 + r2)*(r1+r2));
  }

  function updateBalls(delta) {
    // Move and draw each ball, test collisions,
    for (var i = 0; i < ballArray.length; i++) {
      var ball = ballArray[i];

      // 1) move the ball
      ball.move();

      // 2) test if the ball collides with a wall
      testCollisionWithWalls(ball);

      // 3) draw the ball
      ball.draw();
    }
  }

  function updatePlayer() {
    // The player is just a circle, drawn at the mouse position
    // Just to test circle/circle collision.

    if(inputStates.mousePos) {
      player.x = inputStates.mousePos.x;
      player.y = inputStates.mousePos.y;

       // draws a circle
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.boundingCircleRadius, 0, 2*Math.PI);
      ctx.stroke();
    }

    // if(inputStates.mouseDownPos) {
    //   ctx.save();
    //   ctx.beginPath();
    //   ctx.strokeStyle = 'LightGreen';
    //   ctx.lineWidth = 3;
    //   ctx.moveTo(inputStates.mouseDownPos.x, inputStates.mouseDownPos.y);
    //   ctx.lineTo(inputStates.mousePos.x, inputStates.mousePos.y);
    //   ctx.stroke();
    //   ctx.restore();
    // }
  }

  function distanceBettweenToPoints(x1, y1, x2, y2) {
    return Math.sqrt( Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) );
  }

  function angleBetween2Lines(x1, y1, x2, y2, x3, y3, x4, y4) {
    var dx1 = x2-x1, dy1 = y2-y1, dx2 = x4-x3, dy2 = y4-y3;

    var d = dx1*dx2 + dy1*dy2;   // dot product of the 2 vectors
    var l2 = (dx1*dx1+dy1*dy1)*(dx2*dx2+dy2*dy2); // product of the squared lengths

    return Math.acos(d/Math.sqrt(l2));
  }

  function drawAxis(x, y, theta, r) {
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
  }

  function checkBallControllable() {
    for (var i = 0; i < ballArray.length; i++) {
        var ball = ballArray[i];

        if(circleCollide(player.x, player.y, player.boundingCircleRadius, ball.x, ball.y, ball.radius)) {
          ball.drawSelection();
          ctx.fillText("Collision", 150, 20);
          ctx.strokeStyle = ctx.fillStyle = 'red';

        } else {
          ctx.fillText("No collision", 150, 20);
          ctx.strokeStyle = ctx.fillStyle = 'black';
        }

        if (ball.isInLaunchPosition() && inputStates.mouseDownPos && circleCollide(inputStates.mouseDownPos.x, inputStates.mouseDownPos.y, player.boundingCircleRadius, ball.x, ball.y, ball.radius)) {
          ball.drawSelection();

          if(inputStates.mousedown) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = 'LightGreen';
            ctx.lineWidth = 3;
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(inputStates.mousePos.x, inputStates.mousePos.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = 'BlueViolet';
            ctx.fillStyle = 'BlueViolet';
            ctx.moveTo(ball.x, 0);
            ctx.lineTo(ball.x, h);
            ctx.stroke();
            ctx.moveTo(0, ball.y);
            ctx.lineTo(w, ball.y);
            ctx.stroke();
            ctx.fillText("0", w-25, ball.y+25);
            ctx.fillText("90", ball.x-30, h-25);
            ctx.fillText("180", 25, ball.y-25);
            ctx.fillText("270", ball.x+25, 50);
            ctx.fillStyle = 'Black';

            ctx.beginPath();
            ctx.strokeStyle = 'Red';
            ctx.moveTo(ball.x, ball.y);
            ctx.lineTo(ball.x + 25, ball.y);
            ctx.stroke();

            var angle = angleBetween2Lines(ball.x, ball.y, inputStates.mousePos.x, inputStates.mousePos.y, ball.x, ball.y, ball.x + 25, ball.y);

            ctx.fillText("Angle " + angle  * (180/ Math.PI), 50, 150)

            currentBallParams = {
              angle: Math.PI + angle,
              v: distanceBettweenToPoints(ball.x, ball.y, inputStates.mousePos.x, inputStates.mousePos.y),
              isSet: true
            };
            ctx.restore();
          }
        }

        if (currentBallParams.isSet && !inputStates.mousedown) {
          ball.angle  = currentBallParams.angle;
          ball.v = currentBallParams.v;
          currentBallParams.isSet = false;
        }

    }
  }

  function testCollisionWithWalls(ball) {
      // left
      if (ball.x < ball.radius) {
          ball.x = ball.radius;
          ball.collisionReset(); // set current values like speed, angle, and reset run time to zero
          ball.angle = -ball.angle + Math.PI;

      }
      // right
      if (ball.x > w - (ball.radius)) {
          ball.x = w - (ball.radius);
          ball.collisionReset();
          ball.angle = -ball.angle + Math.PI;
      }
      // up
      if (ball.y < ball.radius) {
          ball.y = ball.radius;
          ball.collisionReset();
          ball.angle = -ball.angle;
      }
      // down
      if (ball.y > h - (ball.radius)) {
          ball.y = h - (ball.radius);
          ball.collisionReset();
          ball.angle = -ball.angle;
      }
  }

  function createMainBall() {
    ballArray = [];
    var ball = new Ball(w/2,
                  h/2,
                  Math.PI/2,
                  (1),
                  15);

    ballArray[0] = ball;
  }

  function createBalls(numberOfBalls) {
      // Start from an empty array
      ballArray = [];

      for (var i = 0; i < numberOfBalls; i++) {
          // Create a ball with random position and speed.
          // You can change the radius
          var ball = new Ball(w * Math.random(),
                  h * Math.random(),
                  (2 * Math.PI) * Math.random(),
                  (100),
                  15);


          ballArray[i] = ball;

      }
  }

// constructor function for balls
  function Ball(x, y, angle, v, diameter) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.v = v;
      this.radius = diameter / 2;
      this.color = 'DarkOrange';
      this.runTime = 0;
      this.hitVelocity = 0;
      this.hitAngle = 0;

      this.draw = function () {
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle = this.color;
          ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
          ctx.fill();
          ctx.restore();
      };

      this.drawSelection = function () {
        ctx.save();
        ctx.beginPath();
        if (this.isInLaunchPosition()) {
            ctx.beginPath();
            ctx.strokeStyle = 'LightGreen';
            ctx.lineWidth=3;
              ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI);
            ctx.stroke();
          };
        ctx.restore();
      };

      this.vX = function () {
        return this.v * Math.cos(this.angle);
      }

      this.vY = function () {
        return this.v * Math.sin(this.angle) + (gravityAcceleration * this.runTime);
      }

      this.currentVelocity = function () {
        return Math.sqrt(this.vX()*this.vX() + this.vY()*this.vY());
      }

      this.currentAngle = function () {
        var value = Math.atan2(this.vY(), this.vX());
        return isNaN(value) ? 0 : value;
      }

      this.move = function () {
          // add horizontal increment to the x pos
          // add vertical increment to the y pos

          this.runTime += delta;

          var incX = this.vX();
          var incY = this.vY();

         this.x += calcDistanceToMove(delta, incX);
         this.y += calcDistanceToMove(delta, incY);

      };

      this.collisionReset = function () {
        var vXCollisionReduction = 1; // ball rolls, velocity reduction factor per collision
        var vYCollisionReduction = 30; // ball hits velocity reduction factor per collision

        this.runTime = 0;
        this.angle = this.currentAngle();
        this.hitAngle = this.angle;
        this.hitVelocity = this.v;
        // You should use ball's hit side and angle to this side.
        // So, means ball could glide both by x and y coodinates
        // There are two situations gliding (rolling) and hit.
        // Each one depends on angle and hit side
        // means that hide side and ball direction are near to parallel position
        if (Math.abs(this.vY()) > Math.abs(this.vX())) {
          this.v = this.currentVelocity() - vYCollisionReduction;
        } else {
          this.v = this.currentVelocity() - vXCollisionReduction;
        }

        if (this.v < 0) {
          this.v = 0;
        }
      }

      this.isInLaunchPosition = function() {
        return (this.v == 0);
      }
  }

  function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
    return delta;

  }

  var mainLoop = function(time){
      //main function, called each frame
      measureFPS(time);

      // number of ms since last frame draw
      delta = timer(time);

      // Clear the canvas
      clearCanvas();

      // Update balls positions
      updateBalls(delta);

      updatePlayer();

      checkBallControllable();


      drawAxis(w/2, h/2, ballArray[0].hitAngle, 200);
      drawAxis(w/2, h/2, 235 * (Math.PI / 180), 200);

      updateTelemetry(ballArray[0]);

      // call the animation loop every 1/60th of second
      requestAnimationFrame(mainLoop);
  };


  function getMousePos(evt) {
      // necessary to take into account CSS boudaries
      var rect = canvas.getBoundingClientRect();
      return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
      };
  }


  var start = function(){
      // adds a div for displaying the fps value
      fpsContainer = document.createElement('div');
      document.body.appendChild(fpsContainer);

      telemetryContainer = document.createElement('div');
      document.body.appendChild(telemetryContainer);

      // Canvas, context etc.
      canvas = document.querySelector("#myCanvas");

      // often useful
      w = canvas.width;
      h = canvas.height;

      // important, we will draw with this object
      ctx = canvas.getContext('2d');
      // default police for text
      ctx.font="20px Arial";

    // TODO: Use this later
     //add the listener to the main, window object, and update the states
    // window.addEventListener('keydown', function(event){
    //     if (event.keyCode === 37) {
    //        inputStates.left = true;
    //     } else if (event.keyCode === 38) {
    //        inputStates.up = true;
    //     } else if (event.keyCode === 39) {
    //        inputStates.right = true;
    //     } else if (event.keyCode === 40) {
    //        inputStates.down = true;
    //     }  else if (event.keyCode === 32) {
    //        inputStates.space = true;
    //     }
    // }, false);

    //if the key will be released, change the states object
    window.addEventListener('keyup', function(event){
        if (event.keyCode === 37) {
           inputStates.left = false;
        } else if (event.keyCode === 38) {
           inputStates.up = false;
        } else if (event.keyCode === 39) {
           inputStates.right = false;
        } else if (event.keyCode === 40) {
           inputStates.down = false;
        } else if (event.keyCode === 32) {
           inputStates.space = false;
        }
    }, false);

    // Mouse event listeners
    canvas.addEventListener('mousemove', function (evt) {
        inputStates.mousePos = getMousePos(evt);
    }, false);

    canvas.addEventListener('mousedown', function (evt) {
          inputStates.mousedown = true;
          inputStates.mouseButton = evt.button;
          inputStates.mouseDownPos = getMousePos(evt);
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
        inputStates.mousedown = false;
        inputStates.mouseDownPos = null; // clean mouse down position
    }, false);


    createMainBall();

    requestAnimationFrame(mainLoop);

  };

  //our GameFramework returns a public API visible from outside its scope
  return {
      start: start
  };
};
