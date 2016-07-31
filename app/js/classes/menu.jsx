import Graphical from './graphical';
import MenuButton from './menu-button';
import canvasData from '../canvas-data';
import { GAME_AREA_BORDER } from '../constants';

export default class Menu extends Graphical {

  constructor(title, xOffset, yOffset, buttonSpacing=3) {
    super();
    this.title = title;
    this.buttons = [];
    let w = this.canvas().width;
    this.xOffset = w/2 - 195;
    this.yOffset = GAME_AREA_BORDER + 55;
    this.buttonSpacing = buttonSpacing;
  }

  addButton(title, clickHandler, isVisible=true, width = 390, height = 50) {
    let button = new MenuButton(...this._buttonCoordinatesByIndex(height, this.buttons.length), width, height, title, isVisible);
    button.releaseHandler = clickHandler;
    this.buttons.push(button);
    return button;
  }

  _buttonCoordinatesByIndex(height, index) {
    return [this.xOffset,(this.yOffset + ((this.buttonSpacing + height) * index))]
  }

  visibleButtons() {
    return this.buttons.filter(function(button) { return button.isVisible; });
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

    let visibleBtns = this.visibleButtons();

    for(var i=0; i < visibleBtns.length; i++) {
      // update button position
      visibleBtns[i].updatePosition(...this._buttonCoordinatesByIndex(visibleBtns[i].h, i));
      visibleBtns[i].draw();
      // Draw button that was selected by user
      visibleBtns[i].processCursor(player, inputStates);
    }
  }
}
