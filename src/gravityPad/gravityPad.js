import { game, world } from '../game';
import { LAND_SCALE } from  '../world/world';

const PAD_SCALE = 0.2;
/**
 * Gravity Pad
 * @class Player
 */
export class GravityPad {

  constructor ( { x = 0, y = 0, type = 'antiGravity' } = {} ) {
    this.game = game;
    this.currentLocation = {
      x,
      y
    };
    this.type = type;
  }

/**
 * Render event in the Phaser cycle.
 */
  render () {
    this.pad = this.game.gravityPadsLayer.create(this.currentLocation.x, this.currentLocation.y, 'gravityPad');
    this.pad.scale.setTo(PAD_SCALE, PAD_SCALE);

    this.game.physics.p2.enable(this.pad, false);

    this.pad.body.kinematic = true;
    this.pad.body.data.shapes[0].sensor = true;
    this.pad.anchor.x = .5;
    this.pad.anchor.y = .5;

    this.pad.body.onBeginContact.add(contact, this);

    this.emitter = this.game.add.emitter(0, 0, 50);

    this.pad.addChild(this.emitter);

    this.setup();

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        world.changeGravityDirection(this.type);
      }
    }
  }

  setup() {
    this.emitter.width = 100;
    this.emitter.height = 100;

    switch ( this.type ) {
      case 'antiGravity':
        this.emitter.makeParticles('blue_ball');
        break;
      case 'up':
        this.emitter.makeParticles('red_ball');
        this.pad.body.angle = 180;
        break;
      case 'right':
        this.emitter.makeParticles('green_ball');
        this.pad.body.angle = -45;
        break;
      case 'left':
        this.emitter.makeParticles('purple_ball');
        this.pad.body.angle = 90;
        break;
      default:
        this.emitter.makeParticles('blue_ball');
    }

    this.emitter.setXSpeed(-5, 5);
    this.emitter.setYSpeed(-300, -200);
    this.emitter.setAlpha(1, 0, 1000);

    this.emitter.minParticleScale = 0.5;
    this.emitter.maxParticleScale = 1;
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;
    this.emitter.gravity = 0

    this.emitter.start(false, 1000, 5, 0);
  }
}
