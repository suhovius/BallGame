import { testCollisionWithWalls, testCollisionWithBricks, testCollisionWithScorePoints, circleCollide } from './collision-detection';
import { drawAxis, updateTelemetry, drawCollisionAngles } from './debug-utils';
import { distanceBettweenToPoints, findNewPointBy, angleBetween2Lines } from './math-utils';
import canvasData from './canvas-data';
import GraphicBall from './classes/graphic-ball';
import CompetitorBall from './classes/competitor-ball';
import FriendlyBall from './classes/friendly-ball';
import NeutralBall from './classes/neutral-ball';
import PlayerBall from './classes/player-ball';
import Brick from './classes/brick';
import SquareBrick from './classes/square-brick';
import Gate from './classes/gate';
import BlackHole from './classes/black-hole';
import ScorePoint from './classes/score-point';
import MenuButton from './classes/menu-button';
import Menu from './classes/menu';
import Level from './classes/level';
import { GAME_AREA_BORDER, MAX_POWER_INIT, POWER_BOOST } from './constants';
import { clearCanvas, updatePlayerCursor, updateGates, drawGameAreaBorder, checkBallControllable, updateBlackHoles, calculateSoundGainForBallCollision } from './framework-functions';
import { getAudioContext } from './global-audio-context';
import sounds from './sounds';

export default function() {

  var musicPlayer = sounds.play("gameSoundtrack");

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

  var powerBoost = POWER_BOOST;

  var maxBallSpeed = powerBoost * MAX_POWER_INIT;

  // vars for handling inputs
  var inputStates = {};

  var ballArray = [];
  var bricksArray = [];
  var gatesArray = [];
  var scorePointsArray = [];
  var blackHolesArray = [];

  var statsBall = new GraphicBall(20, 120, 20, "#FF6633");
  var statsScorePointGold = new ScorePoint(15, 520, "gold");
  var statsScorePointSilver = new ScorePoint(15, 550, "silver");
  var statsScorePointSteel = new ScorePoint(15, 580, "steel");

  const PLAYER_STATS_INIT = {
    "balls" : 3,
    "levels" : {},
    "totalScore" : 0,
    "goldCount" : 0,
    "silverCount" : 0,
    "steelCount" : 0,
    "levels" : {}
  };

  var playerStats = Object.assign({}, PLAYER_STATS_INIT);

  playerStats.calculateTotalScore = function() {
    this.totalScore = 0;
    this.goldCount = 0;
    this.silverCount = 0;
    this.steelCount = 0;
    for (var number in playerStats["levels"]) {
      this.totalScore += playerStats["levels"][number]["score_points"].reduce(function(sum, score) { return sum + score.weight;}, 0);

      for (let scorePoint of playerStats["levels"][number]["score_points"]) {
        switch(scorePoint.type) {
        case "gold":
          this.goldCount++;
          break;
        case "silver":
          this.silverCount++;
          break;
        case "steel":
          this.steelCount++;
          break;
        }
      }
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
    testCollisionBetweenBalls(ballArray);
    let result = {};
    // Move and draw each ball, test collisions,
    for (var i = 0; i < ballArray.length; i++) {
      var ball = ballArray[i];

      // 1) move the ball
      ball.move(delta);

      // 2) test if the ball collides with a wall
      testCollisionWithWalls(w, h, gameAreaBorder, ball);

      bricksArray = testCollisionWithBricks(bricksArray, ball);

      if (ball instanceof PlayerBall) {
        checkBallControllable(ball, player, inputStates, powerBoost, ctx);

        result = testCollisionWithScorePoints(scorePointsArray, ball);
        scorePointsArray = result["available"];

        if (result["collected"].length > 0) {
          playerStats["levels"][currentLevel.number]["score_points"] = playerStats["levels"][currentLevel.number]["score_points"].concat(result["collected"]);
          playerStats.calculateTotalScore();
        }
      }

      if (ball instanceof CompetitorBall) {
        ball.actionLogic(ballArray, delta);
      }

      if (ball instanceof FriendlyBall) {
        ball.actionLogic(ballArray, delta);
      }

      testGateHits(ball);

      testBlackHoleHits(ball);

      // 3) draw the ball
      ball.draw(ctx);
    }
  }

  function createPlayerBall(x, y) {
    var ball = new PlayerBall(x, y, 20, "#FF6633", 0, 0, 'LightGreen');

    ballArray.push(ball);
  }

  function testCollisionBetweenBalls(ballArray) {
    let collisionAngle, newCoordinates;

    for (var i = 0; i < ballArray.length; i++) {
      for (var j = i + 1; j < ballArray.length; j++) {
        if (circleCollide(ballArray[i].x, ballArray[i].y, ballArray[i].radius, ballArray[j].x, ballArray[j].y, ballArray[j].radius)) {
          // Reset ball position to avoid mixing it with another ball's position. Avoid overlapping.
          collisionAngle = angleBetween2Lines(ballArray[i].x, ballArray[i].y, ballArray[j].x, ballArray[j].y, ballArray[i].x, ballArray[i].y, ballArray[i].x+25, ballArray[i].y);
          newCoordinates = findNewPointBy(ballArray[i].x, ballArray[i].y, collisionAngle, ballArray[i].radius + ballArray[j].radius);
          ballArray[j].x = newCoordinates.x;
          ballArray[j].y = newCoordinates.y;

          [ballArray[i].v, ballArray[j].v] = [ballArray[j].v, ballArray[i].v];

          [ballArray[i].angle, ballArray[j].angle] = [ballArray[j].angle, ballArray[i].angle];

          sounds.play("ballToBallCollisionHit", { "gain" : calculateSoundGainForBallCollision(Math.max(ballArray[i].v, ballArray[j].v)) });
        }
      }
    }
  }

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
    ctx.fillStyle = "#33CC33";
    ctx.fillText("Level Score: " + playerStats["levels"][currentLevel.number]["totalScore"], 10, 30);
    ctx.fillText("Total Score: " + playerStats.totalScore, 10, 55);
    ctx.fillText("x " + playerStats.balls, 38, 127);
    ctx.fillText("x " + playerStats.goldCount, 28, 526);
    ctx.fillText("x " + playerStats.silverCount, 28, 556);
    ctx.fillText("x " + playerStats.steelCount, 28, 586);
    ctx.restore();
    statsBall.draw();
    statsScorePointGold.draw();
    statsScorePointSilver.draw();
    statsScorePointSteel.draw();
  }

  function testGateHits(ball) {
    for (var i = 0; i < gatesArray.length; i++) {
      if (distanceBettweenToPoints(gatesArray[i].x, gatesArray[i].y, ball.x, ball.y) < 5) {
        // Gate hit detected
        if ((gatesArray[i].type === "finish") && (ball instanceof PlayerBall) ) {
          sounds.play("levelComplete");
          currentGameState = gameStates.nextLevelMenu;
        }
      }
    }
  }

  function removeBallFromArray(ballArray, ball) {
    return ballArray.filter(function(array_ball) { return array_ball.uuid != ball.uuid; });
  }

  function testBlackHoleHits(ball) {
    for (var i = 0; i < blackHolesArray.length; i++) {
      if (distanceBettweenToPoints(blackHolesArray[i].x, blackHolesArray[i].y, ball.x, ball.y) < blackHolesArray[i].radius) {
        // Black Hole hit detected
        ball.isAlive = false;
        ballArray = removeBallFromArray(ballArray, ball);
        blackHolesArray[i].setBallInside(ball);
        sounds.play("lostInBlackHole");
        if (ball instanceof PlayerBall) {
          playerStats.balls--;
          if (playerStats.balls > 0) {
            var startGate = getStartGate(gatesArray);
            createPlayerBall(startGate.x, startGate.y);
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

          blackHolesArray = updateBlackHoles(blackHolesArray, delta);

          updateBricks();

          updateScorePoints();
          // Update balls positions
          updateBalls();

          updateStats();

          // drawAxis(ctx, w, h, w/2, h/2, ballArray[0].hitAngle, 200);
          // drawAxis(ctx, w, h, w/2, h/2, 235 * (Math.PI / 180), 200);

          // updateTelemetry(telemetryContainer, ballArray[0]);
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
    ballArray = currentLevel.loadBalls();
    bricksArray = currentLevel.loadBricks();
    gatesArray = currentLevel.loadGates();
    blackHolesArray = currentLevel.loadBlackHoles();
    scorePointsArray = currentLevel.loadScorePoints();
    var startGate = getStartGate(gatesArray);
    createPlayerBall(startGate.x, startGate.y);
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
