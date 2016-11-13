import { game, world } from '../game';
import { LAND_SCALE } from  '../world/world';

const POWERUP_SCALE = 0.5;
/**
 * Gravity Pad
 * @class Player
 */
export class PowerUp {

  constructor ( { x = 0, y = 0, type = 'autofire' } = {} ) {
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
  setup () {
    this.powerUp = this.game.gravityPadsLayer.create(this.currentLocation.x, this.currentLocation.y, 'autofire-power-up', 6);
    this.powerUp.scale.setTo(POWERUP_SCALE, POWERUP_SCALE);

    this.game.physics.p2.enable(this.powerUp, false);

    this.powerUp.body.kinematic = true;
    this.powerUp.body.data.shapes[0].sensor = true;
    this.powerUp.anchor.x = 0.5;
    this.powerUp.anchor.y = 0.5;

    this.powerUp.body.onBeginContact.add(contact, this);

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        // console.log(body);
      }
    }
  }

}
