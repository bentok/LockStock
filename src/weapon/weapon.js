import { game } from '../game';

export class Weapon extends Phaser.State {

  constructor ({ character = {} } = {}) {
    super();
    this.game = game;
    this.character = character;
    this.velocity = 600;
    this.rate = 60;
    this.spread = 10;
    this.bulletsPerShot = 5;
    this.damage = 20 * this.bulletsPerShot;
    this.capacity = 2;
    this.currentCapacity = this.capacity; //spawn with full clip
    this.nextFire = 0;
    this.reloadDelay = 400;
  }

  render () {
    this.game.projectilesLayer = this.game.add.group();
    this.game.projectilesLayer.enableBody = true;
    this.game.projectilesLayer.physicsBodyType = Phaser.Physics.P2;
    this.game.projectilesLayer.createMultiple(1000, 'bullet');
    this.game.projectilesLayer.setAll('checkWorldBounds', true);
    this.game.projectilesLayer.setAll('outOfBoundsKill', true);
    this.game.physics.p2.enable(this.game.projectilesLayer, false, true);
  }

  fire () {
    // Offset to avoid collision between player and their own bullets
    const aimOffset = this.character.aimDirection === 'right' ? 20 : -20;
    if (this.game.time.now > this.nextFire && this.game.projectilesLayer.countDead() > 0) {
      this.nextFire = this.game.time.now + this.rate;
      let projectiles =  [];
      for (let i = 0; i < this.bulletsPerShot; i++) {
        projectiles.push(this.game.projectilesLayer.getFirstDead());
        if (projectiles[i]) {
          projectiles[i].reset(this.character.sprite.x + aimOffset, this.character.sprite.y);
          // Number of shells fired per shot
          this.discharge(this.bulletsPerShot);
          const dest = {
            projectile: projectiles[i],
            x: this.calculateTrajectory({ i, coordinate: this.character.reticle.body.x }),
            y: this.calculateTrajectory({ i, coordinate: this.character.reticle.body.y }),
            velocity: this.velocity
          }
          this.game.physics.arcade.moveToXY(dest.projectile, dest.x, dest.y, dest.velocity);
        }
        setTimeout(() => {
          projectiles[i].destroy();
        }, 10000)
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
    if( this.currentCapacity === 0 ){
      this.reload();
    }
  }

  reload () {
    this.nextFire = this.game.time.now + this.reloadDelay;
    this.currentCapacity = this.capacity;
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
