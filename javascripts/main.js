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
    var fps;
    // for time based animation
    var delta, oldTime = 0;

    // vars for handling inputs
    var inputStates = {};

    // array of balls to animate
    var ballArray = [];

  // We want the object to move at speed pixels/s (there are 60 frames in a second)
    // If we are really running at 60 frames/s, the delay between frames should be 1/60
    // = 16.66 ms, so the number of pixels to move = (speed * del)/1000. If the delay is twice
    // longer, the formula works : let's move the rectangle twice longer!
  var calcDistanceToMove = function(delta, speed) {
    //console.log("#delta = " + delta + " speed = " + speed);
    return (speed * delta) / 1000;
  };

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

    function testCollisionWithWalls(ball) {
        // left
        if (ball.x < ball.radius) {
            ball.x = ball.radius;
            ball.angle = -ball.angle + Math.PI;
        }
        // right
        if (ball.x > w - (ball.radius)) {
            ball.x = w - (ball.radius);
            ball.angle = -ball.angle + Math.PI;
        }
        // up
        if (ball.y < ball.radius) {
            ball.y = ball.radius;
            ball.angle = -ball.angle;
        }
        // down
        if (ball.y > h - (ball.radius)) {
            ball.y = h - (ball.radius);
            ball.angle = -ball.angle;
        }
    }

    function createMainBall() {
      ballArray = [];
      var ball = new Ball(w,
                    h,
                    Math.PI / 2,
                    (0),
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

        this.draw = function () {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
            this.drawSelection();
        };

        this.drawSelection = function() {
          ctx.save();
          ctx.beginPath();
          if (this.isInLaunchPosition()) {
              ctx.beginPath();
              ctx.strokeStyle = 'LightGreen';
              ctx.lineWidth=3;
                ctx.arc(this.x, this.y, this.radius + 5, 0, 2 * Math.PI);
              ctx.stroke();
            };
          ctx.restore();
        };

        this.move = function () {
            // add horizontal increment to the x pos
            // add vertical increment to the y pos

            var incX = this.v * Math.cos(this.angle);
            var incY = this.v * Math.sin(this.angle);

            this.x += calcDistanceToMove(delta, incX);
            this.y += calcDistanceToMove(delta, incY);
        };

        this.isInLaunchPosition = function() {
          return this.v == 0
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

        // Canvas, context etc.
        canvas = document.querySelector("#myCanvas");

        // often useful
        w = canvas.width;
        h = canvas.height;

        // important, we will draw with this object
        ctx = canvas.getContext('2d');
        // default police for text
        ctx.font="20px Arial";

       //add the listener to the main, window object, and update the states
      window.addEventListener('keydown', function(event){
          if (event.keyCode === 37) {
             inputStates.left = true;
          } else if (event.keyCode === 38) {
             inputStates.up = true;
          } else if (event.keyCode === 39) {
             inputStates.right = true;
          } else if (event.keyCode === 40) {
             inputStates.down = true;
          }  else if (event.keyCode === 32) {
             inputStates.space = true;
          }
      }, false);

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
      }, false);

      canvas.addEventListener('mouseup', function (evt) {
          inputStates.mousedown = false;
      }, false);


      createMainBall();

      requestAnimationFrame(mainLoop);

    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};
