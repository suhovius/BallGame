import Ball from './ball';
import { findNewPointBy, angleBetween2Lines } from '../math-utils';

export default class BallCompetitor extends Ball {

  actionLogic(playerBall, delta) {
    let aimingSlingEndCoordinates;
    if (playerBall) {
      if (this.isInLaunchPosition()) {
        this.drawSelection();
        if (!this.aiming) {
          this.aiming = true;
        };
        if (this.aiming) {
          this.aimingTimeRemaining -= delta;
        }
        this.angle = angleBetween2Lines(this.x, this.y, playerBall.x, playerBall.y, this.x, this.y, this.x+25, this.y);

        aimingSlingEndCoordinates = findNewPointBy(this.x, this.y, Math.PI + this.angle, 100);

        this.drawSlingTo(aimingSlingEndCoordinates.x, aimingSlingEndCoordinates.y);
        if (this.aimingTimeRemaining <= 0) {
          this.aiming = false;
          this.v = 500;
        }
      } else {
        this.aimingTimeRemaining = 5 * 1000; // 5 seconds
      }
    }
  }

}
