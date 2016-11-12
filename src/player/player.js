import { game } from '../game';
import { Move } from '../move/move';
import { Weapon } from '../weapon/weapon';
import { LAND_SCALE } from  '../world/world';

const RETICLE_SCALE = 0.5; //always half of LAND_SCALE
const PLAYER_SCALE = 3; // 4 times LAND_SCALE

/**
 * Player
 * @class Player
 */
export class Player {

  /**
   * @param  {Number} health Current health of the character
   * @param  {Number} maxHealth Maximum possible health for the character
   * @param  {Number} speed Walking speed for character
   */
  constructor ({ health = 100, maxHealth = 100, speed = 25 } = {}) {
    this.game = game;
    this.move = new Move({ character: this });
    this.weapon = new Weapon({ character: this });
    this.currentLocation = {
      x: 100,
      y: 100
    };
    this.direction = 'right';
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shootButton = game.input.activePointer.leftButton;


    /**
     * Character stats can have modifiers
     */
    this.fallVelocity = 0;
    this.hasAutoFire = false;
    this.health = health;
    this.maxHealth = maxHealth;
    this.speed = speed;
  }

/**
 * Render event in the Phaser cycle.
 */
  render () {
    this.sprite = this.game.playerLayer.create(this.currentLocation.x, this.currentLocation.y, 'player');
    this.reticle = this.game.uiLayer.create(this.currentLocation.x, this.currentLocation.y, 'reticle');
    this.reticle.scale.setTo(RETICLE_SCALE * LAND_SCALE, RETICLE_SCALE * LAND_SCALE);
    this.sprite.scale.setTo(PLAYER_SCALE * LAND_SCALE, PLAYER_SCALE * LAND_SCALE);

    // Applies p2 physics to player, and collision with world bounds
    this.game.physics.p2.enable(this.game.playerLayer, false, true);
    this.game.physics.p2.enable(this.reticle, false);


    this.reticle.body.kinematic = true;
    this.reticle.body.data.shapes[0].sensor = true;

    this.keys = this.game.input.keyboard.createCursorKeys();

    this.sprite.body.onBeginContact.add(contact, this);
    this.game.input.addMoveCallback(this.moveReticle, this);

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        if (body.sprite.key === 'bullet' ) {
          console.info('you have been shot!');
          this.subtractHealth(20);
        }
        if (body.sprite.key === 'map' ) {
          this.standing = true;
        }
      }
      this.standing = true;
    }

    this.sprite.body.fixedRotation = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.checkWorldBounds = true;

    this.reticle.body.static = true;
    this.weapon.render();

  }

  /**
   *  Keep the reticle on the cursor position
   */
  moveReticle (pointer, x, y, isDown) {
    this.reticle.body.x = x;
    this.reticle.body.y = y;
  }

  /**
   * Update event in Phaser cycle
   */
  update () {
    this.playerControls();
  }

  playerControls () {
    // Keyboard controls
    if (this.keys.left.isDown) {
      this.move.left();
    } else if (this.keys.right.isDown) {
      this.move.right();
    }  else {
      this.move.idle();
    }

    // Shoot
    if (this.shootButton.isDown) {
      if (!this.shotDelay) {
        let shot = this.weapon.fire();
        if ( shot ) {
          this.calculateKickback();
        }
        if (!this.hasAutoFire) {
          this.shotDelay = true;
        }
      }
    } else {
      this.shotDelay = false;
    }

    // Jump
    if (this.jumpButton.isDown ) {
      if (this.jumpTimer > this.game.time.now) {
        this.standing = false;
        this.sprite.body.velocity.y = this.speed * -10;
      } else if ( this.standing ) {
        this.jumpTimer = this.game.time.now + 250;
      }
    }
  }

  /**
   * Calculate the velocity push-back when weapon is fired.
   */
  calculateKickback () {
    if ( this.sprite.x > this.reticle.x ) {
      let difference = (this.sprite.x - this.reticle.x) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.x = difference * 40;
    } else {
      let difference = (this.reticle.x - this.sprite.x) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.x = -(difference * 40);
    }

    if ( this.sprite.y > this.reticle.y ) {
      let difference = (this.sprite.y - this.reticle.y) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.y = difference * 40;
    } else {
      let difference = (this.reticle.y - this.sprite.y) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.y = -(difference * 40 );
    }
  }

  /**
   * Add health to the characters current health.
   * @param {Number} amount The amount of health to add to the characters current health
   */
  addHealth (amount) {
    this.health = this.health + amount <= this.maxHealth ? this.health += amount : this.maxHealth;
  }

  /**
   * Subtract health from the characters current health.
   * @param  {Number} amount Amount of health to subtract from the character
   */
  subtractHealth (amount) {
    this.health = this.health - amount >= 0 ? this.health -= amount : 0;
    if ( this.health <= 0 ) {
    //  TODO: death animation
    // TODO: respawn?
    }
  }

  /**
   * Set the location of the character.
   */
  set location ({ x = 0, y = 0 } = {}) {
    this.sprite.position.x = this.currentLocation.x = x;
    this.sprite.position.y = this.currentLocation.y = y;
  }

  /**
   * Get the location of the character.
   */
  get location () {
    if (this.sprite) {
      return {
        x: this.sprite.position.x,
        y: this.sprite.position.y,
      };
    }
  }

}
