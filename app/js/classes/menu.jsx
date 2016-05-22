import { circRectsOverlap } from '../collision-detection';
import Graphical from './graphical';
import MenuButton from './menu-button';
import canvasData from '../canvas-data';
import { GAME_AREA_BORDER } from '../constants';

export default class Menu extends Graphical {

  constructor(title) {
    super();
    this.title = title;
    this.buttons = [];
  }

  addButton(title, clickHandler) {
    let w = this.canvas().width;
    let button = new MenuButton(w/2 - 195, GAME_AREA_BORDER + 55 + (53 * this.buttons.length), 390, 50, title);
    button.releaseHandler = clickHandler
    this.buttons.push(button);
    return button;
  }

  // TODO player and inputStates should be imported as singleton objects
  draw(player, inputStates) {
    let ctx = this.context();
    let w = this.canvas().width;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle="#33CC33";
    ctx.font = "70px Arial";
    ctx.fillText(this.title, 35, 70);
    ctx.rect(w/2 - 200, GAME_AREA_BORDER + 50, 400, 400);
    ctx.strokeStyle = "grey";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();


    for(var i=0; i < this.buttons.length; i++) {
      this.buttons[i].draw();
      // Draw button that was selected by user
      if ((player.x && player.y) && circRectsOverlap(this.buttons[i].x, this.buttons[i].y, this.buttons[i].w, this.buttons[i].h, player.x, player.y, 1)) {
        this.buttons[i].drawSelection();

        if (inputStates.mouseDownPos && (inputStates.mouseDownPos.x == player.x && inputStates.mouseDownPos.y == player.y)) {
          this.buttons[i].click();
        }

        if (inputStates.mouseUpPos && (inputStates.mouseUpPos.x == player.x && inputStates.mouseUpPos.y == player.y)) {
          this.buttons[i].release();
        }
      }
    }
  }
}
