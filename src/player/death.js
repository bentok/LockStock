import { game } from '../game';
import { Player } from './player';
import { LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from  '../world/world';

/**
 * Responsible for events that happen on player death
 */

export class Death {

  /**
   * @param {Class} character Character object for accessing individual player stats
   */
  constructor({ character = {} } = {}) {
    this.character = character;
  }

  /**
   * Series of events that happen on player death
   */
  subtractLife () {
    Math.floor(Math.random() * 2) === 0 ? game.deathOne.play() : game.deathTwo.play();
    this.character.lives--;
    this.character.respawn();
    this.character.weapon.respawn();
    this.character.healthBar.update();
  }

}
