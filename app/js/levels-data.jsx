import { GAME_AREA_BORDER } from './constants';
import canvasData from './canvas-data';

function startGateParams(x, y) {
  return [x, y, 23, "A", "#A8A8A8", "start"];
}

function finishGateParams(x, y) {
  return [x, y, 23, "Z", "#009900", "finish"];
}

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
        startGateParams(w/2, (h-GAME_AREA_BORDER-10)),
        finishGateParams((w-GAME_AREA_BORDER-15), (GAME_AREA_BORDER+15))
      ]
    },
    {
      "bricks" : [
        [w - GAME_AREA_BORDER - 120, (GAME_AREA_BORDER + 50), 20, 450, "#600080"],
        [w - GAME_AREA_BORDER - 200, (GAME_AREA_BORDER), 20, 300, "#cc5200"],
        [GAME_AREA_BORDER, (GAME_AREA_BORDER + 30), 250, 20, "#6600cc"],

        [GAME_AREA_BORDER + 120, (GAME_AREA_BORDER + 52), 20, 54, "#0080ff"],
        [GAME_AREA_BORDER + 178, (GAME_AREA_BORDER + 86), 50, 20, "#0080ff"],
        [GAME_AREA_BORDER + 230, (GAME_AREA_BORDER + 52), 20, 54, "#0080ff"],

        [GAME_AREA_BORDER + 73, (GAME_AREA_BORDER + 140), 225, 20, "#6600cc"],
        [GAME_AREA_BORDER, (GAME_AREA_BORDER + 250), 250, 20, "#e6e600"],
        [GAME_AREA_BORDER + 50, (GAME_AREA_BORDER+100), 20, 100, "#39e600"],
        [w - GAME_AREA_BORDER - 50, (GAME_AREA_BORDER + 30), 50, 30, "#0066cc"],
        [w - GAME_AREA_BORDER - 100, (GAME_AREA_BORDER + 120), 50, 30, "#ffcc00"],
        [w - GAME_AREA_BORDER - 50, (GAME_AREA_BORDER + 210), 50, 30, "#0066cc"],
        [w - GAME_AREA_BORDER - 100, (GAME_AREA_BORDER + 300), 50, 30, "#ffcc00"],
        [w - GAME_AREA_BORDER - 50, (GAME_AREA_BORDER + 390), 50, 30, "#0066cc"]
      ],
      "square_bricks" : [
        [GAME_AREA_BORDER + 20, (GAME_AREA_BORDER + 350), 30, "#ff6699"],
        [GAME_AREA_BORDER + 100, (GAME_AREA_BORDER + 350), 30, "#e6004c"],
        [GAME_AREA_BORDER + 180, (GAME_AREA_BORDER + 350), 30, "#ff6699"],
        [GAME_AREA_BORDER + 260, (GAME_AREA_BORDER + 350), 30, "#e6004c"],
        [GAME_AREA_BORDER + 62, (GAME_AREA_BORDER + 420), 30, "#ff6699"],
        [GAME_AREA_BORDER + 142, (GAME_AREA_BORDER + 420), 30, "#e6004c"],
        [GAME_AREA_BORDER + 222, (GAME_AREA_BORDER + 420), 30, "#ff6699"],
        [GAME_AREA_BORDER + 302, (GAME_AREA_BORDER + 420), 30, "#e6004c"],
        [w - GAME_AREA_BORDER - 153, (GAME_AREA_BORDER + 50), 30, "#00e673"],
        [w - GAME_AREA_BORDER - 153, (GAME_AREA_BORDER + 150), 30, "#00e673"],
        [w - GAME_AREA_BORDER - 153, (GAME_AREA_BORDER + 250), 30, "#00e673"],
        [w - GAME_AREA_BORDER - 153, (GAME_AREA_BORDER + 350), 30, "#00e673"]
      ],
      "gates" : [
        startGateParams((w-GAME_AREA_BORDER-15), (h-GAME_AREA_BORDER-10)),
        finishGateParams((GAME_AREA_BORDER+15), (GAME_AREA_BORDER+15))
      ]
    },
    {
      "bricks" : [
        [GAME_AREA_BORDER + 150, (GAME_AREA_BORDER + 240), 200, 20, "#0080ff"],
        [GAME_AREA_BORDER+130, (GAME_AREA_BORDER + 100), 20, 260, "#33cc33"],
        [GAME_AREA_BORDER+130, (GAME_AREA_BORDER), 20, 65, "#33cc33"],
        [GAME_AREA_BORDER+130, (h - GAME_AREA_BORDER - 65), 20, 65, "#33cc33"],
        [GAME_AREA_BORDER+352, (GAME_AREA_BORDER + 100), 20, 377, "#33cc33"],
        [GAME_AREA_BORDER+352, (GAME_AREA_BORDER), 20, 65, "#33cc33"],
        [GAME_AREA_BORDER, (h - GAME_AREA_BORDER - 65), 100, 20, "#00cc66"]
      ],
      "square_bricks" : [
        [w/2 - 15, (GAME_AREA_BORDER + 295), 30, "#33cc33"],
        [w/2 + 58, (GAME_AREA_BORDER + 480), 20, "#e6004c"],
        [w/2, (GAME_AREA_BORDER + 480), 20, "#e6004c"],
        [w/2 - 60, (GAME_AREA_BORDER + 480), 20, "#e6004c"],

        [w/2 + 58, (GAME_AREA_BORDER + 435), 20, "#e6004c"],
        [w/2, (GAME_AREA_BORDER + 435), 20, "#e6004c"],
        [w/2 - 60, (GAME_AREA_BORDER + 435), 20, "#e6004c"],

        [w/2 + 58, (GAME_AREA_BORDER + 388), 20, "#e6004c"],
        [w/2, (GAME_AREA_BORDER + 388), 20, "#e6004c"],
        [w/2 - 60, (GAME_AREA_BORDER + 388), 20, "#e6004c"],

        [GAME_AREA_BORDER + 98, (GAME_AREA_BORDER + 290), 30, "#ffff00"],
        [GAME_AREA_BORDER+50, (GAME_AREA_BORDER + 190), 30, "#ffff00"],
        [GAME_AREA_BORDER, (GAME_AREA_BORDER + 90), 30, "#ffff00"]
      ],
      "gates" : [
        startGateParams((w/2), (h/2 + 30)),
        finishGateParams((w/2), (h/2 - 30))
      ]
    }

  ][level-1];
}
