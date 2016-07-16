import Ball from './ball';
import { findNewPointBy, angleBetween2Lines, randomArrayValue } from '../math-utils';

export default class AutomaticBall extends Ball {

  findTarget(targetsArray) {
    return randomArrayValue(targetsArray);
  }

  actionLogic(targetsArray, delta) {
    let aimingSlingEndCoordinates;
    if (!this.target || (!!this.target && (this.target.isAlive == false))) {
      this.target = this.findTarget(targetsArray);
    }
    if (this.target) {
      if (this.isInLaunchPosition()) {
        this.drawSelection();
        if (!this.aiming) {
          this.aiming = true;
        };
        if (this.aiming) {
          this.aimingTimeRemaining -= delta;
        }
        this.angle = angleBetween2Lines(this.x, this.y, this.target.x, this.target.y, this.x, this.y, this.x+25, this.y);

        aimingSlingEndCoordinates = findNewPointBy(this.x, this.y, Math.PI + this.angle, 100);

        this.drawSlingTo(aimingSlingEndCoordinates.x, aimingSlingEndCoordinates.y);
        if (this.aimingTimeRemaining <= 0) {
          this.aiming = false;
          this.target = null;
          this.v = 500;
        }
      } else {
        this.aimingTimeRemaining = 5 * 1000; // 5 seconds
      }
    }
  }

}
