import { SpawnPoints } from '../world/spawnPoint';
import { Player, PLAYER_SCALE } from './player';
import { LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from  '../world/world';

export class Enemy extends Player {
  constructor ({ health = 100, maxHealth = 100, speed = 15, x = WORLD_WIDTH * LAND_SCALE / 2, y = WORLD_HEIGHT * LAND_SCALE / 2 } = {}) {
    super({ health, maxHealth, speed, x, y });
    this.name = 'Enemy1';
    this.isEnemy = false;
    // Selects a color for the enemy player from the other colors left after green is taken.
    this.playerColor = Player.PLAYER_COLORS[Math.floor(Math.random() * (Player.PLAYER_COLORS.length - 1)) + 1];
    this.spawnPoint.x = x;
    this.spawnPoint.y = y;
  }
  update () {
    this.checkForFallToDeath();
    this.getAimDirection();
  }
  setupReticle () {}
  moveReticle () {}
  calculateKickback () {}
  set aimDirection (_ignored) { }

  render () {
    this.sprite = this.game.playerLayer.create(this.spawnPoint.x, this.spawnPoint.y, `${this.playerColor}Player`);
    this.sprite.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    this.sprite.scale.setTo(PLAYER_SCALE * LAND_SCALE, PLAYER_SCALE * LAND_SCALE);
    this.sprite.anchor.setTo(0.5, 0.5);

    // Applies p2 physics to player, and collision with world bounds

    this.sprite.checkWorldBounds = true;
  }
}
