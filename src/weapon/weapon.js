import { game } from '../game';

export class Weapon extends Phaser.State {

  constructor ({ character = {}, velocity = 600, rate = 60, spread = 10, bulletsPerShot = 5, baseDamage = 20, capacity = 2, reloadDelay = 400 } = {}) {
    super();
    this.game = game;
    this.spawnSettings = {
      bulletsPerShot,
      character,
      velocity,
      spread,
      rate,
    };
    this.character = character;
    this.velocity = velocity;
    this.rate = rate;
    this.spread = spread;
    this.bulletsPerShot = bulletsPerShot;
    this.damage = baseDamage * this.bulletsPerShot;
    this.capacity = capacity;
    this.currentCapacity = this.capacity; // spawn with full clip
    this.nextFire = 0;
    this.reloadDelay = reloadDelay;
  }

  respawn () {
    this.bulletsPerShot = this.spawnSettings.bulletsPerShot;
    this.character = this.spawnSettings.character;
    this.velocity = this.spawnSettings.velocity;
    this.spread = this.spawnSettings.spread;
    this.rate = this.spawnSettings.rate;
  }

  render () {
    this.game.projectilesLayer.enableBody = true;
    this.game.projectilesLayer.physicsBodyType = Phaser.Physics.P2;
    this.game.projectilesLayer.createMultiple(1000, 'bullet');
    this.game.projectilesLayer.setAll('checkWorldBounds', true);
    this.game.projectilesLayer.setAll('outOfBoundsKill', true);
    this.game.physics.p2.enable(this.game.projectilesLayer, false, true);
  }

  fire ({ aimX, aimY } = { aimX: 0, aimY: 0 }, sendToOpponent = true) {
    if (sendToOpponent && this.character.peerConnection && this.character.peerConnection.connection) {
      this.character.peerConnection.send({
        type: 'OPPONENT_SHOOT',
        aimX,
        aimY
      });
    }
    // Offset to avoid collision between player and their own bullets
    const aimOffset = this.character.aimDirection === 'right' ? 20 : -20;
    if (this.game.time.now > this.nextFire && this.game.projectilesLayer.countDead() > 0) {
      this.nextFire = this.game.time.now + this.rate;
      const projectiles =  [];
      for (let i = 0; i < this.bulletsPerShot; i++) {
        projectiles.push(this.game.projectilesLayer.getFirstDead());
        if (projectiles[i]) {
          projectiles[i].reset(this.character.sprite.x + aimOffset, this.character.sprite.y);
          // Number of shells fired per shot
          this.discharge(this.bulletsPerShot);
          const dest = {
            projectile: projectiles[i],
            x: this.calculateTrajectory({ i, coordinate: aimX }),
            y: this.calculateTrajectory({ i, coordinate: aimY }),
            velocity: this.velocity
          };
          this.game.physics.arcade.moveToXY(dest.projectile, dest.x, dest.y, dest.velocity);
        }
        setTimeout(() => {
          projectiles[i].destroy();
        }, 10000);
      }
      return true;
    }
    return false;
  }

  calculateTrajectory ({ i = 0, coordinate = 0, spread = this.spread } = {}) {
    const verticalOffset = i / 2 * spread;
    return i % 2 === 0 ? coordinate - verticalOffset : coordinate + verticalOffset;
  }

  discharge (shells) {
    this.currentCapacity = this.currentCapacity - shells > 0 ? this.currentCapacity - shells : 0;
    // TEMP
    if ( this.currentCapacity === 0 ) {
      this.reload();
    }
  }

  reload () {
    this.nextFire = this.game.time.now + this.reloadDelay;
    this.currentCapacity = this.capacity;
  }

  doubleShot () {
    this.bulletsPerShot = 10;
  }

  highAcuracy () {
    this.spread = 0;
    this.reloadDelay = 100;
    this.bulletsPerShot = 1;
    this.velocity = 800;
  }

  set bulletVelocity (newVelocity = this.velocity) {
    this.velocity = newVelocity;
  }

  get bulletVelocity () {
    return this.velocity;
  }

  set bulletRate (newrate = this.rate) {
    this.rate = newrate;
  }

  get bulletRate () {
    return this.rate;
  }

  set bulletSpread (newSpread = this.spread) {
    this.spread = newSpread;
  }

  get bulletSpread () {
    return this.spread;
  }

  set numBullets (newnumBullets = this.numBullets) {
    this.numBullets = newNumBullets;
  }

  get numBullets () {
    return this.numBullets;
  }

  set bulletDamage (newDamage = this.damage) {
    this.damage = newDamage;
  }

  get bulletDamage () {
    return this.damage;
  }

  set bulletCapacity (newCapacity = this.capacity) {
    this.capacity = newCapacity;
  }

  get bulletCapacity () {
    return this.capacity;
  }

}
