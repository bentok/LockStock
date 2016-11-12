import { game } from '../game';

export class Weapon extends Phaser.State {

  constructor ({ character = {} } = {}) {
    super();
    this.game = game;
    this.character = character;
    this.speed = 400;
    this.rate = 60;
    this.spread = 2;
    this.numBullets = 5;
    this.damage = 20 * this.numBullets;
    this.capacity = 2;
  }

  render () {
    this.projectile = this.game.add.weapon(30, 'bullet');
    this.projectile.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    this.projectile.bulletSpeed = this.velocity;
    this.projectile.fireRate = this.rate;
    this.projectile.trackSprite(this.character.sprite, 0, 0, true);
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