import Constants from '../constants';
import Graphical from './graphical';
import { hex2rgb, calcDistanceToMove, moveFromToLocationOffsetsXY } from '../math-utils'
import GraphicBall from './graphic-ball';

export default class BlackHole extends Graphical {

  constructor(x, y, diameter, contentsToCollapseNumber) {
    super();
    this.x = x;
    this.y = y;
    this.radius = diameter / 2;
    this.initialRadius = this.radius;
    this.status = "active";
    this.contents = [];
    this.contentsToCollapseNumber = contentsToCollapseNumber;
  }

  collapseRate() {
    return this.radius / this.initialRadius;
  }

  calculateNewCollapseRadius() {
    if (!!this.contentsToCollapseNumber) {
      if (this.contentsToCollapseNumber >= this.contents.length) {
        return Math.floor((1 - this.contents.length / this.contentsToCollapseNumber) * this.initialRadius);
      } else {
        return 0;
      }
    }
  }

  draw(delta) {
    if (this.isCollapsing()) {
      this.collapse(delta);
    }

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
    this.drawContents(delta);
  }

  setBallInside(ball) {
    let innerBall = new GraphicBall(ball.x, ball.y, 2 * ball.radius, ball.color);
    innerBall.initialColor = innerBall.color;
    innerBall.initialHotSpotColor = innerBall.hotSpotColor;

    this.contents.push(innerBall);

    if (this.shouldCollapse()) {
      this.startCollapse();
    }
  }

  drawContents(delta) {
    let contentItem;
    for (var i = 0; i < this.contents.length; i++) {
      contentItem = this.contents[i];
      contentItem.radius = contentItem.radius * this.collapseRate();
      contentItem.color = hex2rgb(contentItem.initialColor, this.collapseRate());
      contentItem.hotSpotColor = hex2rgb(contentItem.initialHotSpotColor, this.collapseRate());

      let offsetsXY = moveFromToLocationOffsetsXY(contentItem.x, contentItem.y, this.x, this.y, calcDistanceToMove(300, delta));
      if (Math.abs(contentItem.x - this.x) > 5 ) {
        contentItem.x += offsetsXY[0];
      } else {
        contentItem.x = this.x;
      }

      if (Math.abs(contentItem.y - this.y) > 5 ) {
        contentItem.y += offsetsXY[1];
      }  else {
        contentItem.y = this.y;
      }

      if (!(contentItem.x == this.x && contentItem.y == this.y)) {
        contentItem.draw();
      }

    }
  }

  startCollapse() {
    if (this.shouldCollapse()) {
      this.status = "collapse";
    }
  }

  shouldCollapse() {
    return this.contents.length > 0;
  }


  isCollapsing() {
    return this.status == "collapse";
  }

  isDisappeared() {
    return this.status == "disappeared";
  }

  collapse(delta) {
    if (this.radius > 3 && this.status == "collapse") {
      let newRadius = this.calculateNewCollapseRadius();
      if (this.radius > newRadius) {
        this.radius = this.radius - 0.01 * delta;
      }
    } else {
        this.status = "disappeared"
    }
  }

}
