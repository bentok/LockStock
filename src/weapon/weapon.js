import { game } from '../game';

export class Weapon extends Phaser.State {

  constructor ({ character = {} } = {}) {
    super();
    this.game = game;
    this.character = character;
    this.velocity = 400;
    this.rate = 60;
    this.spread = 10;
    this.numPellets = 5;
    this.damage = 20 * this.numPellets;
    this.capacity = 2;
    this.currentCapacity = this.capacity; //spawn with full clip
    this.nextFire = 0;
    this.reloadDelay = 1000;
  }

  render () {

    this.projectiles = this.game.add.group();
    this.projectiles.enableBody = true;
    this.projectiles.physicsBodyType = Phaser.Physics.ARCADE;
    this.projectiles.createMultiple(100, 'bullet');
    this.projectiles.setAll('checkWorldBounds', true);
    this.projectiles.setAll('outOfBoundsKill', true);
  }

  fire () {
    if (this.game.time.now > this.nextFire && this.projectiles.countDead() > 0) {
        this.nextFire = this.game.time.now + this.rate;
        let projectiles =  [];
        for (let i = 0; i < this.numPellets; i++) {
          projectiles.push(this.projectiles.getFirstDead());
          projectiles[i].reset(this.character.sprite.x / 2, this.character.sprite.y / 2);
          this.discharge(1); //number of shells fired per shot
          const dest = {
            projectile: projectiles[i],
            x: this.calculateTrajectory({ i, coordinate: this.character.reticle.body.x / 2 }),
            y: this.calculateTrajectory({ i, coordinate: this.character.reticle.body.y / 2 }),
            velocity: this.velocity
          }
          this.game.physics.arcade.moveToXY(dest.projectile, dest.x, dest.y, dest.velocity);
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