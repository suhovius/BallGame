import Brick from './brick';
import { hex2rgb } from '../math-utils'

export default class BreakableBrick extends Brick {
  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = hex2rgb(this.color, 0.3);

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.strokeStyle = '#00ffcc';
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
