import { game } from '../game';
import { Player } from './player';
import { LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from  '../world/world';

export class Death {

  constructor({ character = {} } = {}) {
    this.character = character;
  }

  subtractLife () {
    this.character.lives--;
    this.character.respawn();
    this.character.weapon.respawn();

    if (this.character.lives <= 0) {
      console.log(`Game over ${this.character.name}`);
    }
  }

}