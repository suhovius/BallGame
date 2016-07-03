import Graphical from './graphical';

export default class GraphicBall extends Graphical {

  constructor(x, y, diameter, color) {
    super();
    this.x = x;
    this.y = y;
    this.radius = diameter / 2;
    this.color = color;
    this.hotSpotColor = '#E0E0E0';
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    var innerRadius = 1,
        outerRadius = this.radius * 1;

    var gradient = ctx.createRadialGradient(this.x-this.radius * 0.3, this.y -this.radius * 0.3, innerRadius, this.x -this.radius * 0.3, this.y-this.radius * 0.3, outerRadius);
    gradient.addColorStop(0, this.hotSpotColor);
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;

    ctx.fill();
    ctx.restore();
  }

}
