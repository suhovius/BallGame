import AutomaticBall from './automatic-ball';
import PlayerBall from './player-ball';
import { randomArrayValue } from '../math-utils';

export default class CompetitorBall extends AutomaticBall {

  findTarget(targetsArray) {
    return randomArrayValue(targetsArray.filter(function(targetObject, index) { return targetObject instanceof PlayerBall; }));
  }

}
