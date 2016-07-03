import Constants from '../constants';
import Graphical from './graphical';
import { hex2rgb, calcDistanceToMove, moveFromToLocationOffsetsXY } from '../math-utils'
import GraphicBall from './graphic-ball';

export default class BlackHole extends Graphical {

  constructor(x, y, diameter) {
    super();
    this.x = x;
    this.y = y;
    this.radius = diameter / 2;
    this.initialRadius = this.radius;
    this.status = "active";
    this.content = null;
  }

  collapseRate() {
    return this.radius / this.initialRadius;
  }

  draw(delta) {
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
    if (this.content) {
      this.content.radius = this.content.radius * this.collapseRate();
      this.content.color = hex2rgb(this.content.initialColor, this.collapseRate());
      this.content.hotSpotColor = hex2rgb(this.content.initialHotSpotColor, this.collapseRate());

      let offsetsXY = moveFromToLocationOffsetsXY(this.content.x, this.content.y, this.x, this.y, calcDistanceToMove(300, delta));
      if (Math.abs(this.content.x - this.x) > 5 ) {
        this.content.x += offsetsXY[0];
      } else {
        this.content.x = this.x;
      }

      if (Math.abs(this.content.y - this.y) > 5 ) {
        this.content.y += offsetsXY[1];
      }  else {
        this.content.y = this.y;
      }

      this.content.draw();
    }
  }

  setBallInside(ball) {
    let innerBall = new GraphicBall(ball.x, ball.y, 2 * ball.radius, ball.color);
    innerBall.initialColor = innerBall.color;
    innerBall.initialHotSpotColor = innerBall.hotSpotColor;

    this.content = innerBall;
  }

  startCollapse() {
    this.status = "collapse";
  }

  isCollapsing() {
    return this.status == "collapse";
  }

  isDisappeared() {
    return this.status == "disappeared";
  }

  collapse(delta) {
    if (this.radius > 3 && this.status == "collapse") {
      this.radius = this.radius - 0.01 * delta;
    } else {
      this.status = "disappeared"
    }
  }

}
