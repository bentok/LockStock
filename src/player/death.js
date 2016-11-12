import { game } from '../game';
import { Player } from './player';
import { LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from  '../world/world';

export class Death {

  constructor({ character = {} } = {}) {
    this.character = character;
  }

  subtractLife () {
    this.character.lives--;
    this.character.sprite.body.x = this.character.spawnLocation.x;
    this.character.sprite.body.y = this.character.spawnLocation.y;
    if (this.character.lives <= 0) {
      console.log(`Game over ${this.character.name}`);
    }
  }
  
}