import { circleCollide, circRectsOverlap, testCollisionWithWalls, resetBallAfterBrickCollision, testCollisionWithBricks } from './collision-detection';
import { drawAxis, updateTelemetry, drawCollisionAngles } from './debug-utils';
import { distanceBettweenToPoints, angleBetween2Lines, calcDistanceToMove, msToSeconds } from './math-utils';
import canvasData from './canvas-data';
import Ball from './classes/ball';
import Brick from './classes/brick';
import SquareBrick from './classes/square-brick';
import Gate from './classes/gate';
import MenuButton from './classes/menu-button';
import Menu from './classes/menu';
import { GAME_AREA_BORDER } from './constants';
import { clearCanvas, updatePlayerCursor, updateGates } from './framework-functions';

export default function() {
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

  var powerBoost = 5;

  // vars for handling inputs
  var inputStates = {};

  // array of balls to animate
  var ballArray = [];
  var bricksArray = [];
  var gatesArray = [];

  var player = {
    x:0,
    y:0,
    boundingCircleRadius: 5
  };

  // game states
  var gameStates = {
      mainMenu: 0,
      gameRunning: 1,
      nextLevelMenu: 2,
      gameOver: 3,
      frozenDebug: 4
  };
  // var currentGameState = gameStates.gameRunning;
  var currentGameState = gameStates.nextLevelMenu;
  var currentLevel = 1;

  var gameAreaBorder = GAME_AREA_BORDER;

  var currentBallParams = {};

  var nextLevelMenu = new Menu("Level Complete!");
  nextLevelMenu.addButton("Start Next Level", function() {}); // TODO Add Levels and next level function here
  nextLevelMenu.addButton("Replay Current Level", function() {
    startGame();
  });

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

  function updateBalls() {
    // Move and draw each ball, test collisions,
    for (var i = 0; i < ballArray.length; i++) {
      var ball = ballArray[i];

      // 1) move the ball
      ball.move(delta);

      // 2) test if the ball collides with a wall
      testCollisionWithWalls(w, h, gameAreaBorder, ball);

      testCollisionWithBricks(bricksArray, ball);

      testGateHits(ball);

      // 3) draw the ball
      ball.draw(ctx);
    }
  }

  function checkBallControllable() {
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

            currentBallParams = {
              angle: Math.PI + angle,
              v: powerInit * powerBoost,
              isSet: true
            };

            ctx.save();
            ctx.fillText("Angle: " + ((2*Math.PI - (Math.PI + angle)) * (180/ Math.PI)).toFixed(2), 10, 20);
            ctx.fillText("Speed: " + currentBallParams.v.toFixed(2), 10, 45);
            ctx.fillText("Power: " + powerInit.toFixed(2), 10, 65);
            ctx.fillText("Boost: " + powerBoost.toFixed(2), 10, 85);
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

        if (currentBallParams.isSet && !inputStates.mousedown) {
          ball.angle  = currentBallParams.angle;
          ball.v = currentBallParams.v;
          currentBallParams.isSet = false;
        }

    }
  }

  function drawGameAreaBorder() {
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, w, gameAreaBorder);
    ctx.rect(0, h-gameAreaBorder, w, gameAreaBorder);
    ctx.rect(0, gameAreaBorder, gameAreaBorder, h-2*gameAreaBorder);
    ctx.rect(w-gameAreaBorder, gameAreaBorder, w-gameAreaBorder, h-2*gameAreaBorder);
    ctx.fillStyle = "#707070";
    ctx.fill();
    ctx.strokeStyle = "#383838";
    ctx.rect(gameAreaBorder,gameAreaBorder,w - 2*gameAreaBorder,h - 2*gameAreaBorder);
    ctx.stroke();
    ctx.restore();
  }

  function createMainBall(x, y) {
    ballArray = [];
    var ball = new Ball(x, y, Math.PI/2, 1, 20, "player");
    ballArray[0] = ball;
  }

  // TODO This might be used later at some levels
  // function createBalls(numberOfBalls) {
  //     // Start from an empty array
  //     ballArray = [];

  //     for (var i = 0; i < numberOfBalls; i++) {
  //         // Create a ball with random position and speed.
  //         // You can change the radius
  //         var ball = new Ball(w * Math.random(),
  //                 h * Math.random(),
  //                 (2 * Math.PI) * Math.random(),
  //                 (100),
  //                 15);


  //         ballArray[i] = ball;

  //     }
  // }

  // This shoud use data from current Level object
  function createBricks() {
    bricksArray.push(new SquareBrick(w/2 - 25, (h/2 - 25), 50, "Grey"));
    bricksArray.push(new SquareBrick(w/2 + 70, (h/2 + 190), 30, "Orange"));
    bricksArray.push(new SquareBrick(w/2 + 101, (h/2 + 160), 30, "Green"));
    bricksArray.push(new SquareBrick(w/2 + 131, (h/2 + 130), 30, "Purple"));
    bricksArray.push(new SquareBrick(w/2 + 161, (h/2 + 100), 30, "#CC3399"));
    bricksArray.push(new SquareBrick(w/2 + 191, (h/2 + 219), 30, "#00CC33"));

    bricksArray.push(new SquareBrick(w/2 - 70, (h/2 - 50), 30, "Orange"));
    bricksArray.push(new SquareBrick(w/2 - 101, (h/2 + 100), 30, "Green"));
    bricksArray.push(new SquareBrick(w/2 - 131, (h/2 - 100), 30, "Purple"));
    bricksArray.push(new SquareBrick(w/2 - 161, (h/2 + 150), 30, "#CC3399"));

    bricksArray.push(new SquareBrick(w - gameAreaBorder - 100, gameAreaBorder + 30, 30, "#00CC33"));

    bricksArray.push(new Brick(gameAreaBorder + 30, (gameAreaBorder + 30), 300, 20, "#0099FF"));

    //bricksArray.push(new Brick(gameAreaBorder + 350, (gameAreaBorder + 100), 150, 50, "#CCFF99"));

//    bricksArray.push(new Brick(gameAreaBorder + 350, (gameAreaBorder + 250), 100, 20, "#0099FF"));

    bricksArray.push(new Brick(gameAreaBorder + 30, (gameAreaBorder + 52), 20, 380, "#0099FF"));

    bricksArray.push(new Brick(gameAreaBorder + 30, (gameAreaBorder + 480), 20, 20, "#0099FF"));
  }

  function updateBricks() {
    for (var i = 0; i < bricksArray.length; i++) {
      bricksArray[i].draw();
    }
  }

  function createGates() {
    gatesArray.push(new Gate(w/2, (h-gameAreaBorder-10), 23, "A", "#A8A8A8", "start"));
    gatesArray.push(new Gate((w-gameAreaBorder-15), (gameAreaBorder+15), 23, "Z", "#009900", "finish"));
    return gatesArray;
  }

  function testGateHits(ball) {
    for (var i = 0; i < gatesArray.length; i++) {
      if (distanceBettweenToPoints(gatesArray[i].x, gatesArray[i].y, ball.x, ball.y) < 5) {
        // Gate hit detected
        if ((gatesArray[i].type === "finish") && (ball.role === "player") ) {
          currentGameState = gameStates.nextLevelMenu;
        }
      }
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
      clearCanvas(ctx, canvas)

      drawGameAreaBorder();

      updatePlayerCursor(player, inputStates);

      switch (currentGameState) {
        case gameStates.gameRunning:

          updateGates(gatesArray);

          updateBricks();
          // Update balls positions
          updateBalls();

          checkBallControllable();

          // drawAxis(ctx, w, h, w/2, h/2, ballArray[0].hitAngle, 200);
          // drawAxis(ctx, w, h, w/2, h/2, 235 * (Math.PI / 180), 200);

          updateTelemetry(telemetryContainer, ballArray[0]);
          // drawCollisionAngles(ctx, w, h, ballArray[0]);

        case gameStates.mainMenu:
          // TODO Add UI menu
          break;
        case gameStates.nextLevelMenu:
          nextLevelMenu.title = "Level " + currentLevel + " Complete!";
          nextLevelMenu.draw(player, inputStates);
          break;
        case gameStates.gameOver:
          ctx.save();
          ctx.beginPath();
          ctx.fillStyle="FF3333";
          ctx.font = "70px Arial";
          ctx.fillText("GAME OVER", 35, 70);
          ctx.restore();
          // TODO! Add more UI friendly information
          break;
      }

      if (currentGameState != gameStates.frozenDebug) {
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle="Red";
        ctx.font = "70px Arial";
        ctx.fillText("Frozen Debug Mode", 35, 70);
        ctx.restore();
        console.log("Frozen Debug Mode");
      }

  };


  function getMousePos(evt) {
    // necessary to take into account CSS boudaries
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
  }

  // TODO This should load current level and start game.
  function startGame() {
    ballArray = [];
    bricksArray = [];
    gatesArray = [];
    createBricks();
    var startGate = createGates().find(function(gate) { return gate.type === "start"; });
    createMainBall(startGate.x, startGate.y);
    currentGameState = gameStates.gameRunning;
  }

  var start = function(){

    // adds a div for displaying the fps value
    fpsContainer = document.createElement('div');
    document.body.appendChild(fpsContainer);

    telemetryContainer = document.createElement('div');
    document.body.appendChild(telemetryContainer);

    // Canvas, context etc.
    canvas = canvasData.getCanvas();

    // often useful
    w = canvas.width;
    h = canvas.height;

    // important, we will draw with this object
    ctx = canvasData.getContext2D();
    //ctx = canvas.getContext('2d');
    // default police for text
    ctx.font="20px Arial";

    // add the listener to the main, window object, and update the states
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
      inputStates.mouseDownPos = getMousePos(evt);
      inputStates.mouseUpPos = null;
    }, false);

    canvas.addEventListener('mouseup', function (evt) {
      inputStates.mousedown = false;
      inputStates.mouseDownPos = null; // clean mouse down position
      inputStates.mouseUpPos = getMousePos(evt);
    }, false);

    startGame();

    requestAnimationFrame(mainLoop);

  };

  //our GameFramework returns a public API visible from outside its scope
  return {
    start: start
  };

};
