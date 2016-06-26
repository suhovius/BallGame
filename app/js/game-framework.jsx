import { testCollisionWithWalls, testCollisionWithBricks, testCollisionWithScorePoints } from './collision-detection';
import { drawAxis, updateTelemetry, drawCollisionAngles } from './debug-utils';
import { distanceBettweenToPoints } from './math-utils';
import canvasData from './canvas-data';
import Ball from './classes/ball';
import Brick from './classes/brick';
import SquareBrick from './classes/square-brick';
import Gate from './classes/gate';
import BlackHole from './classes/black-hole';
import MenuButton from './classes/menu-button';
import Menu from './classes/menu';
import Level from './classes/level';
import { GAME_AREA_BORDER } from './constants';
import { clearCanvas, updatePlayerCursor, updateGates, drawGameAreaBorder, checkBallControllable, updateBlackHoles } from './framework-functions';

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

  var ballArray = [];
  var bricksArray = [];
  var gatesArray = [];
  var scorePointsArray = [];
  var blackHolesArray = [];

  const PLAYER_STATS_INIT = {
    "balls" : 3,
    "levels" : {},
    "totalScore" : 0,
    "levels" : {}
  };

  var playerStats = Object.assign({}, PLAYER_STATS_INIT);

  playerStats.calculateTotalScore = function() {
    this.totalScore = 0;
    for (var number in playerStats["levels"]) {
      this.totalScore += playerStats["levels"][number]["score_points"].reduce(function(sum, score) { return sum + score.weight;}, 0);
    }
    playerStats["levels"][currentLevel.number]["totalScore"] = playerStats["levels"][currentLevel.number]["score_points"].reduce(function(sum, score) { return sum + score.weight;}, 0);
    return this.totalScore;
  };

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
  var currentLevel = new Level(1);

  var gameAreaBorder = GAME_AREA_BORDER;

  var nextLevelMenu = new Menu("Level Complete!");
  nextLevelMenu.addButton("Start Next Level", function() {
    if (currentLevel.hasNextLevel()) {
      currentLevel = currentLevel.getNextLevel();
      startGame();
    }
  });
  nextLevelMenu.addButton("Replay Current Level", function() {
    playerStats["levels"][currentLevel.number]["score_points"] = [];
    playerStats.calculateTotalScore();
    startGame();
  });

  var gameOverMenu = new Menu("GAME OVER!");
  gameOverMenu.addButton("Restart Game", function() {
    if (currentLevel.hasNextLevel()) {
      currentLevel = currentLevel = new Level(1);
      playerStats = Object.assign(playerStats, PLAYER_STATS_INIT);
      startGame();
    }
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
    let result = {};
    // Move and draw each ball, test collisions,
    for (var i = 0; i < ballArray.length; i++) {
      var ball = ballArray[i];

      // 1) move the ball
      ball.move(delta);

      // 2) test if the ball collides with a wall
      testCollisionWithWalls(w, h, gameAreaBorder, ball);

      bricksArray = testCollisionWithBricks(bricksArray, ball);

      result = testCollisionWithScorePoints(scorePointsArray, ball);
      scorePointsArray = result["available"];

      if (result["collected"].length > 0) {
        playerStats["levels"][currentLevel.number]["score_points"] = playerStats["levels"][currentLevel.number]["score_points"].concat(result["collected"]);
        playerStats.calculateTotalScore();
      }

      testGateHits(ball);

      testBlackHoleHits(ball);

      // 3) draw the ball
      ball.draw(ctx);
    }
  }

  function createMainBall(x, y) {
    ballArray = [];
    var ball = new Ball(x, y, 0, 1, 20, "player");
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

  function updateBricks() {
    for (var i = 0; i < bricksArray.length; i++) {
      bricksArray[i].draw();
    }
  }

  function updateScorePoints() {
    for (var i = 0; i < scorePointsArray.length; i++) {
      scorePointsArray[i].draw();
    }
  }

  function updateStats() {
    ctx.save();
    ctx.fillText("Level Score: " + playerStats["levels"][currentLevel.number]["totalScore"], 200, 20);
    ctx.fillText("Total Score: " + playerStats.totalScore, 200, 45);
    ctx.fillText("Balls: " + playerStats.balls, 200, 70);
    ctx.restore();
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

  function testBlackHoleHits(ball) {
    for (var i = 0; i < blackHolesArray.length; i++) {
      if (distanceBettweenToPoints(blackHolesArray[i].x, blackHolesArray[i].y, ball.x, ball.y) < blackHolesArray[i].radius) {
        // Black Hole hit detected
        if (ball.role === "player") {
          playerStats.balls--;
          if (playerStats.balls > 0) {
            var startGate = getStartGate(gatesArray);
            ball.resetPosition(startGate.x, startGate.y);
          } else {
            currentGameState = gameStates.gameOver;
          }
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

      drawGameAreaBorder(ctx, canvas);

      updatePlayerCursor(player, inputStates);

      switch (currentGameState) {
        case gameStates.gameRunning:

          updateGates(gatesArray);

          updateBlackHoles(blackHolesArray);

          updateBricks();

          updateScorePoints();
          // Update balls positions
          updateBalls();

          checkBallControllable(ballArray, player, inputStates, powerBoost, ctx);

          updateStats();

          // drawAxis(ctx, w, h, w/2, h/2, ballArray[0].hitAngle, 200);
          // drawAxis(ctx, w, h, w/2, h/2, 235 * (Math.PI / 180), 200);

          updateTelemetry(telemetryContainer, ballArray[0]);
          // drawCollisionAngles(ctx, w, h, ballArray[0]);

        case gameStates.mainMenu:
          // TODO Add UI menu
          break;
        case gameStates.nextLevelMenu:
          nextLevelMenu.title = "Level " + (currentLevel.number) + " Complete!";
          nextLevelMenu.draw(player, inputStates);
          break;
        case gameStates.gameOver:
          // ctx.save();
          // ctx.beginPath();
          // ctx.fillStyle="FF3333";
          // ctx.font = "70px Arial";
          // ctx.fillText("GAME OVER", 35, 70);
          // ctx.restore();
          gameOverMenu.draw(player, inputStates);
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

  function getStartGate(gatesArray) {
    return gatesArray.find(function(gate) { return gate.type === "start"; });
  }

  // TODO This should load current level and start game.
  function startGame() {
    ballArray = [];
    bricksArray = currentLevel.loadBricks();
    gatesArray = currentLevel.loadGates();
    blackHolesArray = currentLevel.loadBlackHoles();
    scorePointsArray = currentLevel.loadScorePoints();
    var startGate = getStartGate(gatesArray);
    createMainBall(startGate.x, startGate.y);
    playerStats["levels"][currentLevel.number] = {
      "score_points" : [],
      "totalScore" : 0
    }
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
