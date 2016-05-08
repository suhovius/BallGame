import Brick from './brick';

export default class SquareBrick extends Brick {
  constructor(x, y, size, color) {
    super(x, y, size, size, color);
  }
}
