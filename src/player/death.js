import { game } from '../game';
import { Player } from './player';
import { LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from  '../world/world';

export class Death {

  constructor({ character = {} } = {}) {
    this.character = character;
  }

  subtractLife () {
    Math.floor(Math.random() * 2) === 0 ? game.deathOne.play() : game.deathTwo.play();
    this.character.lives--;
    this.character.respawn();
    this.character.weapon.respawn();
    this.character.healthBar.update();

    if (this.character.lives <= 0) {
      console.log(`Game over ${this.character.name}`);
    }
  }

}
