import levelsData from '../levels-data';
import Brick from './brick';
import SquareBrick from './square-brick';
import BreakableBrick from './breakable-brick';
import Gate from './gate';

export default class Level {
  constructor(number) {
    this.number = number;
  }

  loadBricks() {
    let bricks = levelsData(this.number)["bricks"].map(function(brick_args) {
      return new Brick(...brick_args);
    });

    let squareBricks = levelsData(this.number)["square_bricks"].map(function(brick_args) {
      return new SquareBrick(...brick_args);
    });

    let breakableBricks = levelsData(this.number)["breakable_bricks"].map(function(brick_args) {
      return new BreakableBrick(...brick_args);
    });

    return bricks.concat(squareBricks).concat(breakableBricks);
  }

  loadGates() {
    return levelsData(this.number)["gates"].map(function(gate_args) {
      return new Gate(...gate_args);
    });
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
