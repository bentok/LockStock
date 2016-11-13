import { game, world } from '../game';
import { LAND_SCALE } from  '../world/world';

const PAD_SCALE = 0.3;
/**
 * Gravity Pad
 * @class Player
 */

const gravityPadColors = {
  'antiGravity': 'blue',
  'up': 'red',
  'right': 'green',
  'left': 'yellow'
};

export class GravityPad {

  /**
   * @param {String} key Named gravity pad
   * @param {Number} x X coordinate
   * @param {Number} x Y coordinate
   * @param {String} type Type of pad to instantiate
   * @param {Number} angle Rotation of sprite
   */
  constructor ( { key = '', x = 0, y = 0, type = 'antiGravity', angle = 0 } = {} ) {
    this.game = game;
    this.currentLocation = {
      x,
      y
    };
    this.type = type;
    this.color = gravityPadColors[type] || 'blue';
    this.angle = angle;
    this.key = key;
  }

  /**
   * Render event in the Phaser cycle.
   */
  render () {
    this.pad = this.game.gravityPadsLayer.create(this.currentLocation.x, this.currentLocation.y, `button_${this.color}`);
    this.pad.scale.setTo(PAD_SCALE, PAD_SCALE);

    this.game.physics.p2.enable(this.pad, false);

    this.pad.body.angle = this.angle;
    this.pad.body.kinematic = true;
    this.pad.body.data.shapes[0].sensor = true;
    this.pad.anchor.x = 0.5;
    this.pad.anchor.y = 0.5;

    this.pad.body.onBeginContact.add(contact, this);

    this.emitter = this.game.add.emitter(0, 0, 50);

    this.pad.addChild(this.emitter);

    this.setup();

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        if( body.sprite.key === 'greenPlayer' || body.sprite.key === 'bluePlayer' || body.sprite.key === 'pinkPlayer' ){
          world.changeGravityDirection(this.type);
          if (world.user.peerConnection && world.user.peerConnection.connection) {
            world.user.peerConnection.connection.send({
              type: 'GRAVITY_BUTTON_PRESSED',
              key: this.key
            });
          }
          this.pressed = true;
          this.emitter.on = false;
        }
      }
    }
  }

  /**
   * Runs on create event in Phaser cycle.
   */
  setup () {
    this.emitter.width = 100;
    this.emitter.height = 100;
    this.emitter.makeParticles(`${this.color}_ball`);

    this.emitter.setXSpeed(-5, 5);
    this.emitter.setYSpeed(-300, -200);
    this.emitter.setAlpha(1, 0, 1000);

    this.emitter.minParticleScale = 0.5;
    this.emitter.maxParticleScale = 1;
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;
    this.emitter.gravity = 0;

    this.emitter.start(false, 1000, 5, 0);
  }

  /**
   * Set whether gravity button has been set
   */
  set pressed (pressed) {
    if (pressed) {
      this.pad.loadTexture(`button_${this.color}_pressed`);
    } else {
      this.pad.loadTexture(`button_${this.color}`);
    }
    this._pressed = pressed;
  }

  /**
   * Get wether gravity button has been pressed or not
   */
  get pressed () {
    return this._pressed;
  }
}
