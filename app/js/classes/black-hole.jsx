import Constants from '../constants';
import Graphical from './graphical';
import { hex2rgb } from '../math-utils'

export default class BlackHole extends Graphical {

  constructor(x, y, diameter) {
    super();
    this.x = x;
    this.y = y;
    this.radius = diameter / 2;
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    var innerRadius = this.radius * 0.3,
        outerRadius = this.radius * 1;

    var gradient = ctx.createRadialGradient(this.x, this.y , innerRadius, this.x , this.y, outerRadius);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(0.5, hex2rgb('#08088A', 0.3) );
    gradient.addColorStop(1, hex2rgb('#FFFF00', 0.2) );
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    ctx.fill();

    ctx.restore();
  }

}
