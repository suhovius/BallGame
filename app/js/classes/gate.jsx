import Graphical from './graphical';

export default class Gate extends Graphical {
  constructor(x, y, diameter, text, color, type) {
    super();
    this.x = x;
    this.y = y;
    this.radius = diameter / 2;
    this.text = text;
    this.color = color;
    this.type = type; // start, finish
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.fillStyle = "black";
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#808080";
    ctx.lineWidth=3;

    ctx.stroke();
    ctx.fill();

    ctx.fillStyle=this.color;
    ctx.font = (Math.ceil(this.radius*1.5).toString() + "px Arial");
    ctx.fillText(this.text,this.x-this.radius/2,this.y+this.radius/2);

    ctx.restore();
  }
}
