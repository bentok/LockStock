import { Player } from '.';

export class Enemy extends Player {
  constructor ({ health = 100, maxHealth = 100, speed = 15, x = WORLD_WIDTH * LAND_SCALE / 2, y = WORLD_HEIGHT * LAND_SCALE / 2 } = {}) {
    super({ health, maxHealth, speed, x, y });
    this.name = 'Enemy1';
  }
  update () {
    this.checkForFallToDeath();
    this.getAimDirection();
  }
}
