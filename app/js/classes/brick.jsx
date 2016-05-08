import Graphical from './graphical';

export default class Brick extends Graphical {
  constructor(x,y, width, height, color) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height
    this.color = color;

    this.coordinatesHash = {
      bottom: {
        x1: this.x,
        y1: this.y + this.height,
        x2: this.x + this.width,
        y2: this.y + this.height
      },
      top: {
        x1: this.x,
        y1: this.y,
        x2: this.x + this.width,
        y2: this.y
      },
      left: {
        x1: this.x,
        y1: this.y,
        x2: this.x,
        y2: this.y + this.height
      },
      right: {
        x1: this.x + this.width,
        y1: this.y,
        x2: this.x + this.width,
        y2: this.y + this.height
      }
    }
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    var gradientOffset = (this.width > this.height) ? this.height : this.width;

    var gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y + this.height);
    gradient.addColorStop(0, '#E0E0E0');
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;

    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.restore();
  }

  sideLineCoordinates(side) {
    return this.coordinatesHash[side];
  }

  drawCollision(sides) {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0 , 0.5)';
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fill();
    ctx.strokeStyle = 'LightGreen';
    ctx.lineWidth = 3;
    for (var i=0; i < sides.length; i++) {
      ctx.beginPath();
      var lineCoordinates = this.sideLineCoordinates(sides[i]);
      ctx.moveTo(lineCoordinates.x1, lineCoordinates.y1);
      ctx.lineTo(lineCoordinates.x2, lineCoordinates.y2);
      ctx.stroke();
    }

    ctx.restore();
  }
}
