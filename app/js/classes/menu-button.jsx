import Graphical from './graphical';

export default class MenuButton extends Graphical {
  constructor(x, y, w, h, text) {
    super();
    this.x = x;
    this.y = y;
    this.text = text;
    this.w = w;
    this.h = h;
    this.state = "released"; // 'clicked', 'released'
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "grey";
    ctx.fill();

    ctx.fillStyle="#C8C8C8";
    let fontSize = (35 * this.h) / 50;
    ctx.font = fontSize + "px Arial";
    ctx.fillText(this.text, this.x+5, this.y+fontSize);
    ctx.restore();
  }

  drawSelection() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.rect(this.x, this.y, 390, 50);
    ctx.fillStyle = 'rgba(0, 255, 0 , 0.1)';
    ctx.fill();

    ctx.fillStyle="#33CC33";
    ctx.font = "35px Arial";
    ctx.fillText(this.text, this.x+5, this.y+35);
    ctx.restore();
  }

  click() {
    this.state = "clicked";
  }

  releaseHandler() {
    // Assign some code here outside of button
  }

  release() {
    if (this.state === "clicked") {
      this.state = "released";
      // console.log("Menu Button release: " + this.text);
      this.releaseHandler();
    }
  }
}
