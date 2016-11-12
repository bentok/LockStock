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
          projectiles[i].reset(this.character.sprite.x, this.character.sprite.y);
          this.discharge(1); //number of shells fired per shot
          const dest = {
            projectile: projectiles[i],
            x: this.calculateDestination({ i, numPellets: this.numPellets, coordinate: this.character.reticle.body.x }),
            y: this.calculateDestination({ i, numPellets: this.numPellets, coordinate: this.character.reticle.body.y }),
            velocity: this.velocity
          }
          this.game.physics.arcade.moveToXY(dest.projectile, dest.x, dest.y, dest.velocity);
        }
        return true;
    }
    return false;
  }

  calculateDestination ({ i = 0, coordinate = 0, numPellets = 5 } = {}) {
    let yCoord;
    switch (i) {
      case 0:
        yCoord = coordinate;
        break;
      case 1:
        yCoord = coordinate - 10;
        break;
      case 2:
        yCoord = coordinate + 10;
        break;
      case 3:
        yCoord = coordinate - 20;
        break;
      case 4:
        yCoord = coordinate + 20;
        break;
      case 5:
        yCoord = coordinate - 30;
        break;
      case 6:
        yCoord = coordinate + 30;
        break;
      case 7:
        yCoord = coordinate - 40;
        break;
      case 8:
        yCoord = coordinate + 40;
        break;
      case 9:
        yCoord = coordinate - 50;
        break;
      default:
      yCoord = coordinate;
    }
    console.log(yCoord);
    return yCoord;
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