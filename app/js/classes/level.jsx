import levelsData from '../levels-data';
import Brick from './brick';
import SquareBrick from './square-brick';
import BreakableBrick from './breakable-brick';
import ScorePoint from './score-point';
import Gate from './gate';
import BlackHole from './black-hole';
import CompetitorBall from './competitor-ball';
import FriendlyBall from './friendly-ball';
import NeutralBall from './neutral-ball';

export default class Level {
  constructor(number) {
    this.number = number;
  }

  loadBricks() {
    let bricks = [], squareBricks = [], breakableBricks = [];

    if (levelsData(this.number)["bricks"]) {
      bricks = levelsData(this.number)["bricks"].map(function(brick_args) {
        return new Brick(...brick_args);
      });
    }

    if (levelsData(this.number)["square_bricks"]) {
      squareBricks = levelsData(this.number)["square_bricks"].map(function(brick_args) {
        return new SquareBrick(...brick_args);
      });
    }

    if (levelsData(this.number)["breakable_bricks"]) {
      breakableBricks = levelsData(this.number)["breakable_bricks"].map(function(brick_args) {
        return new BreakableBrick(...brick_args);
      });
    }

    return bricks.concat(squareBricks).concat(breakableBricks);
  }

  loadGates() {
    return levelsData(this.number)["gates"].map(function(gate_args) {
      return new Gate(...gate_args);
    });
  }

  loadScorePoints() {
    let scorePoints = [];
    if (levelsData(this.number)["score_points"]) {
      scorePoints = levelsData(this.number)["score_points"].map(function(score_point_args) {
        return new ScorePoint(...score_point_args);
      });
    }

    return scorePoints;
  }

  loadBalls() {
    let balls = [];
    if (levelsData(this.number)["balls"]) {
      balls = levelsData(this.number)["balls"].map(function(ball_args) {
        switch (ball_args[0]) {
          case "competitor":
            return new CompetitorBall(ball_args[1], ball_args[2], 20, "#0000FF", 0, 0, "#cc33ff");
          case "neutral":
            return new NeutralBall(ball_args[1], ball_args[2], 20, "#848484", 0, 0, "#848484");
          case "friendly":
            return new FriendlyBall(ball_args[1], ball_args[2], 20, "#868A08", 0, 0, "#31B404");
        }
      });
    }

    return balls;
  }

  loadBlackHoles() {
    let blackHoles = [];
    if (levelsData(this.number)["black_holes"]) {
      blackHoles = levelsData(this.number)["black_holes"].map(function(black_hole_args) {
        return new BlackHole(...black_hole_args);
      });
    }

    return blackHoles;
  }

  hasNextLevel() {
    return !!levelsData(this.number+1);
  }

  getNextLevel() {
    if (this.hasNextLevel()) {
      return new Level(this.number+1);
    }
  }
}
