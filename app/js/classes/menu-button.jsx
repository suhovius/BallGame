import Graphical from './graphical';
import { circRectsOverlap } from '../collision-detection';
import sounds from '../sounds';

export default class MenuButton extends Graphical {
  constructor(x, y, w, h, text, isVisible = true) {
    super();
    this.x = x;
    this.y = y;
    this.text = text;
    this.w = w;
    this.h = h;
    this.state = "released"; // 'clicked', 'released'
    this.isVisible = isVisible;
    this.isHover = false;
    this.isHoverPrev = false;
  }

  fontSize() {
    return (7 * this.h) / 10;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = "grey";
    ctx.fill();

    ctx.fillStyle="#C8C8C8";
    ctx.font = this.fontSize() + "px Arial";
    ctx.fillText(this.text, this.x+5, this.y+this.fontSize());
    ctx.restore();
  }

  drawSelection() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = 'rgba(0, 255, 0 , 0.1)';
    ctx.fill();

    ctx.fillStyle="#33CC33";
    ctx.font = this.fontSize() + "px Arial";
    ctx.fillText(this.text, this.x+5, this.y+this.fontSize() );
    ctx.restore();
  }

  playCursorHoverSound() {
    if (!this.hasPlayedHoverSound) {
      this.hasPlayedHoverSound = true;
      sounds.play("menuButtonCursorHover");
    }
  }

  processCursor(player, inputStates) {
    if ((player.x && player.y) && circRectsOverlap(this.x, this.y, this.w, this.h, player.x, player.y, 1)) {
      this.drawSelection();

      this.playCursorHoverSound();

      if (inputStates.mouseDownPos && (inputStates.mouseDownPos.x == player.x && inputStates.mouseDownPos.y == player.y)) {
        this.click();
      }

      if (inputStates.mouseUpPos && (inputStates.mouseUpPos.x == player.x && inputStates.mouseUpPos.y == player.y)) {
        this.release();
      }
    } else {
      this.hasPlayedHoverSound = false;
    }

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
