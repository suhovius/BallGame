import canvasData from '../canvas-data';

export default class Graphical {
  context() {
    return canvasData.getContext2D();
  }
};

