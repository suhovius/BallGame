import AutomaticBall from './automatic-ball';
import CompetitorBall from './competitor-ball';
import { randomArrayValue } from '../math-utils';

export default class FriendlyBall extends AutomaticBall {

  findTarget(targetsArray) {
    return randomArrayValue(targetsArray.filter(function(targetObject, index) { return targetObject instanceof CompetitorBall; }));
  }

}
