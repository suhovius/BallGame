import { calcDistanceToMove, generateUUID } from '../math-utils';
import { GRAVITY_ACCELERATION } from '../constants';
import GraphicBall from './graphic-ball';
import sounds from '../sounds';
import { calculateSoundGainForBallCollision } from '../framework-functions';

export default class Ball extends GraphicBall {

  constructor(x, y, diameter, color, angle, v, slingColor) {
    super(x, y, diameter, color);

    this.angle = angle;
    this.v = v;
    this.runTime = 0;
    this.hitVelocity = 0;
    this.hitAngle = 0;
    this.hits = [];
    this.newParams = {};
    this.slingColor = slingColor;
    this.uuid = generateUUID();
  }

  collisionSound() {
    sounds.play("ballCollisionHit", { "gain" : calculateSoundGainForBallCollision(this.v) });
  }

  resetPosition(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.v = 0;
  }

  draw() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();

    var innerRadius = 1,
        outerRadius = this.radius * 1;

    var gradient = ctx.createRadialGradient(this.x-this.radius * 0.3, this.y -this.radius * 0.3, innerRadius, this.x -this.radius * 0.3, this.y-this.radius * 0.3, outerRadius);
    gradient.addColorStop(0, '#E0E0E0');
    gradient.addColorStop(1, this.color);
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 3;

    ctx.fill();
    ctx.restore();
  }

  drawSelection() {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();
    if (this.isInLaunchPosition()) {
      ctx.beginPath();
      ctx.strokeStyle = this.slingColor;
      ctx.lineWidth=3;
      ctx.arc(this.x, this.y, this.radius + 3, 0, 2 * Math.PI);
      ctx.stroke();
    };
    ctx.restore();
  }

  drawSlingTo(toX, toY) {
    let ctx = this.context();
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.slingColor;
    ctx.lineWidth = 3;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  vX() {
    return this.v * Math.cos(this.angle);
  }

  vY() {
    return this.v * Math.sin(this.angle) + (GRAVITY_ACCELERATION * this.runTime);
  }

  currentVelocity() {
    return Math.sqrt(this.vX()*this.vX() + this.vY()*this.vY());
  }

  currentAngle() {
    var value = Math.atan2(this.vY(), this.vX());
    return isNaN(value) ? 0 : value;
  }

  move(delta) {
    // add horizontal increment to the x pos
    // add vertical increment to the y pos

    this.runTime += delta;

    var incX = this.vX();
    var incY = this.vY();

    this.x += calcDistanceToMove(delta, incX);
    this.y += calcDistanceToMove(delta, incY);
  }

  smallestCollisionAngle(surfaceAngle) {
    let smallestAngle = Math.abs(Math.atan2(Math.sin(surfaceAngle-this.currentAngle()), Math.cos(surfaceAngle-this.currentAngle())));
    smallestAngle = (smallestAngle > (Math.PI / 2) ? Math.abs(Math.PI - smallestAngle) : smallestAngle);
    return smallestAngle;
  }

  playCollisonSoundForAngle(surfaceAngle) {
    // if collision angle is more than 5 degrees (empyrical value)
    if (this.smallestCollisionAngle(surfaceAngle) > (5 * (Math.PI/180)) ) {
      this.collisionSound();
    }
  }

  collisionReset(surfaceAngle) {
    this.playCollisonSoundForAngle(surfaceAngle);

    var frictionReduction = 0.01; // ball rolls, velocity reduction factor per collision
    var speedCollisionReduction = 0.1; // ball hits velocity reduction factor per collision
    // TODO use speed this formula too http://stackoverflow.com/questions/9424459/calculate-velocity-and-direction-of-a-ball-to-ball-collision-based-on-mass-and-b
    // Use speed reduction coefficient
    // v -  coefficient * v * angleCoefficient
    // v * (1 - coefficient * angleCoefficient)

    this.runTime = 0;
    this.angle = this.currentAngle();
    this.hitAngle = this.angle;
    this.hitVelocity = this.v;

    let smallestAngle = this.smallestCollisionAngle(surfaceAngle);

    this.hits.push({
      angleBetween: smallestAngle,
      angle: this.hitAngle,
      x: this.x,
      y: this.y
    });

    // You should use ball's hit side and angle to this side.
    // So, means ball could glide both by x and y coodinates
    // There are two situations gliding (rolling) and hit.
    // Each one depends on angle and hit side
    // x = smallestAngle / (Math.PI / 2)

    // this.v = this.currentVelocity() - ((2 * smallestAngle) / Math.PI) * speedCollisionReduction - frictionReduction;
    this.v = this.currentVelocity() * (1- speedCollisionReduction * ((2 * smallestAngle) / Math.PI) - frictionReduction);


    if (this.v < 1) {
      this.v = 0;
    }
  }

  isInLaunchPosition() {
    return (this.v == 0);
  }

}
