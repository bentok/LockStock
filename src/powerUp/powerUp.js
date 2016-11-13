import { game, world } from '../game';
import { LAND_SCALE } from  '../world/world';

const POWERUP_SCALE = 0.4;
/**
 * Power Up
 */
export class PowerUp {

  constructor ( { x = 0, y = 0, type = 'autofire' } = {} ) {
    this.game = game;
    this.currentLocation = {
      x,
      y
    };
    this.type = type;
    this.reActivate = 5000;
    this.fadeTimer = 0;

    switch ( this.type ) {
    case 'autofire':
      this.frame = 6;
      break;
    case 'dblshot':
      this.frame = 11;
      break;
    case 'highAcuracy':
      this.frame = 7;
      break;
    default:
      this.frame = 0;
    }
  }

/**
 * Render event in the Phaser cycle.
 */
  setup () {
    this.powerUp = this.game.gravityPadsLayer.create(this.currentLocation.x, this.currentLocation.y, 'power-up', this.frame);

    this.powerUp.scale.setTo(POWERUP_SCALE, POWERUP_SCALE);

    this.game.physics.p2.enable(this.powerUp, false);
    this.powerUp.body.powerUpType = this.type;
    this.powerUp.body.kinematic = true;
    this.powerUp.body.data.shapes[0].sensor = true;
    this.powerUp.anchor.x = 0.5;
    this.powerUp.anchor.y = 0.5;

    this.powerUp.body.onBeginContact.add(contact, this);

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        if ( (body.sprite.key === 'greenPlayer' || body.sprite.key === 'bluePlayer' || body.sprite.key === 'pinkPlayer') && this.fadeTimer <= this.game.time.now ) {
          this.fadeTimer = this.game.time.now + this.reActivate;
        }
      }
    }
  }

  render () {
    if ( this.fadeTimer > this.game.time.now ) {
      this.powerUp.body.active = false;
      if ( this.powerUp.alpha >= 0.2 ) {
        this.powerUp.alpha -= 0.1;
        this.powerUp.scale.x = this.powerUp.scale.x > 0 ? this.powerUp.scale.x - 0.1 : 0;
        this.powerUp.scale.y = this.powerUp.scale.y > 0 ? this.powerUp.scale.y - 0.1 : 0;
      }
    } else {
      this.powerUp.body.active = true;
      if ( this.powerUp.alpha < 1 ) {
        this.powerUp.scale.x = this.powerUp.scale.x < POWERUP_SCALE ? this.powerUp.scale.x + 0.1 : POWERUP_SCALE;
        this.powerUp.scale.y = this.powerUp.scale.y < POWERUP_SCALE ? this.powerUp.scale.y + 0.1 : POWERUP_SCALE;
        this.powerUp.alpha += 0.1;
      }
    }
  }

}
