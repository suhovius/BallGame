import { GAME_AREA_BORDER } from './constants';
import canvasData from './canvas-data';

export default function levelsData(level) {
  let canvas = canvasData.getCanvas();
  let w = canvas.width;
  let h = canvas.height;

  return [
    {
      "bricks" : [
        [GAME_AREA_BORDER + 30, (GAME_AREA_BORDER + 30), 300, 20, "#0099FF"],
        // [GAME_AREA_BORDER + 350, (GAME_AREA_BORDER + 100), 150, 50, "#CCFF99"],
        //  [GAME_AREA_BORDER + 350, (GAME_AREA_BORDER + 250), 100, 20, "#0099FF"],
        [GAME_AREA_BORDER + 30, (GAME_AREA_BORDER + 52), 20, 380, "#0099FF"],
        [GAME_AREA_BORDER + 30, (GAME_AREA_BORDER + 480), 20, 20, "#0099FF"],
      ],
      "square_bricks" : [
         [w/2 - 25, (h/2 - 25), 50, "Grey"],
         [w/2 + 70, (h/2 + 190), 30, "Orange"],
         [w/2 + 101, (h/2 + 160), 30, "Green"],
         [w/2 + 131, (h/2 + 130), 30, "Purple"],
         [w/2 + 161, (h/2 + 100), 30, "#CC3399"],
         [w/2 + 191, (h/2 + 219), 30, "#00CC33"],
         [w/2 - 70, (h/2 - 50), 30, "Orange"],
         [w/2 - 101, (h/2 + 100), 30, "Green"],
         [w/2 - 131, (h/2 - 100), 30, "Purple"],
         [w/2 - 161, (h/2 + 150), 30, "#CC3399"],
         [w - GAME_AREA_BORDER - 100, GAME_AREA_BORDER + 30, 30, "#00CC33"]
      ],
      "gates" : [
        [w/2, (h-GAME_AREA_BORDER-10), 23, "A", "#A8A8A8", "start"],
        [(w-GAME_AREA_BORDER-15), (GAME_AREA_BORDER+15), 23, "Z", "#009900", "finish"]
      ]
    }
  ][level-1];
}
