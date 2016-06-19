import levelsData from '../levels-data';
import Brick from './brick';
import SquareBrick from './square-brick';
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

    return bricks.concat(squareBricks);
  }

  loadGates() {
    return levelsData(this.number)["gates"].map(function(gate_args) {
      return new Gate(...gate_args);
    });
  }
}
