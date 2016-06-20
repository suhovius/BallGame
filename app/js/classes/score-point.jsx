import Graphical from './graphical';

export default class ScorePoint extends Graphical {
  constructor(x,y,type) {
    super();
    this.x = x;
    this.y = y;
    this.radius = 7;

    switch(type) {
    case "gold":
      this.weight = 100;
      this.color = "#FFD700";
      break;
    case "silver":
      this.weight = 50;
      this.color = "#c0c0c0";
      break;
    case "steel":
      this.weight = 10;
      this.color = "#B0C4DE";
    }
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;

    ctx.fill();
    ctx.restore();
  }
}
