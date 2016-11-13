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
    this.game.projectilesLayer.createMultiple(100, 'bullet');
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
          console.log(projectiles[i]);
          projectiles[i].body.onBeginContact.add(contact, projectiles[i]);

          function contact (body) {
            if (body && body.sprite.key !== 'bullet' ) {
              projectiles[i].destroy();
            }
          }
        }
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

  set bulletSpread (newspread = this.spread) {
    this.spread = newspread;
  }

  get bulletSpread () {
    return this.spread;
  }

  set bulletNumBullets (newnumBullets = this.numBullets) {
    this.numBullets = newnumBullets;
  }

  get bulletNumBullets () {
    return this.numBullets;
  }

  set bulletDamage (newdamage = this.damage) {
    this.damage = newdamage;
  }

  get bulletDamage () {
    return this.damage;
  }

  set bulletCapacity (newcapacity = this.capacity) {
    this.capacity = newcapacity;
  }

  get bulletCapacity () {
    return this.capacity;
  }

}
