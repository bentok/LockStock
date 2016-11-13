import { Player } from '.';

export class Enemy extends Player {
  constructor ({ health = 100, maxHealth = 100, speed = 15, x = WORLD_WIDTH * LAND_SCALE / 2, y = WORLD_HEIGHT * LAND_SCALE / 2 } = {}) {
    super({ health, maxHealth, speed, x, y });
    this.name = 'Enemy1';
    // Selects a color for the enemy player from the other colors left after green is taken.
    this.playerColor = Player.PLAYER_COLORS[Math.floor(Math.random() * Player.PLAYER_COLORS.length)];
  }
  update () {
    this.checkForFallToDeath();
    this.getAimDirection();
  }
  set aimDirection (aimDirection) {
    this._aimDirection = aimDirection;
  }
}
