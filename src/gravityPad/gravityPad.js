import { game } from '../game';
import { LAND_SCALE } from  '../world/world';

const PAD_SCALE = 0.2;
/**
 * Gravity Pad
 * @class Player
 */
export class GravityPad {

  constructor ( { x = 0, y = 0 } = {} ) {
    this.game = game;
    this.currentLocation = {
      x,
      y
    };
  }

/**
 * Render event in the Phaser cycle.
 */
  render () {
    this.pad = this.game.playerLayer.create(this.currentLocation.x, this.currentLocation.y, 'gravityPad');
    this.pad.scale.setTo(PAD_SCALE * LAND_SCALE, PAD_SCALE * LAND_SCALE);

    this.game.physics.p2.enable(this.pad, false);

    this.pad.body.kinematic = true;
    this.pad.body.data.shapes[0].sensor = true;
    this.pad.anchor.x = .5;
    this.pad.anchor.y = .5;

    this.pad.body.onBeginContact.add(contact, this);


    this.emitter = this.game.add.emitter(0, 0, 400);

    this.pad.addChild(this.emitter);

    this.emitter.width = 100;

    this.emitter.makeParticles('rain');

    this.emitter.minParticleScale = 0.1;
    this.emitter.maxParticleScale = 0.5;

    this.emitter.setXSpeed(-5, 5);
    this.emitter.setYSpeed(-150, -75);

    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;

    this.emitter.start(false, 250, 5, 0);

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        console.info('Changing Gravity!');
      }
    }

  }

}
