import { game } from '../game';
import { Move } from '../move/move';
import { Weapon } from '../weapon/weapon';

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
      x: 10,
      y: 10
    };
    this.direction = 'right';
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shootButton = game.input.activePointer.leftButton;
    this.game.input.addMoveCallback(this.moveReticle, this);

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
    this.reticle = this.game.playerLayer.create(this.currentLocation.x, this.currentLocation.y, 'reticle');
    this.reticle.scale.setTo(0.1, 0.1);

    // Applies p2 physics to player, and collision with world bounds
    this.game.physics.p2.enable([this.sprite, this.reticle], false);

    this.keys = this.game.input.keyboard.createCursorKeys();

    this.sprite.body.onBeginContact.add(contact, this);

    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        console.log(body);
        if( body.sprite.key === 'bullet' ) {
          this.subtractHealth(20);
        }
      }
      this.standing = true;
    }

    this.sprite.body.fixedRotation = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.checkWorldBounds = true;

    this.reticle.body.static = true;
    this.weapon.render();

    // Loads Phaser presets for arrow key input

  }

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

    if (this.jumpButton.isDown ) {
      if (this.jumpTimer > this.game.time.now) {
        this.standing = false;
        this.sprite.body.velocity.y = this.speed * -25;
      } else if ( this.standing ) {
        this.jumpTimer = this.game.time.now + 250;
      }
    }

    if ( !this.standing ) {
      // if no collider and jump duration expired the player should fall
      if ( this.jumpTimer <= this.game.time.now ) {
        this.falling();
        // if no collider and during jump duration but not holding jump the player should start falling
      } else if (!this.jumpButton.isDown) {
        this.falling();
      }
    } else {
      // player on a collider
      this.fallVelocity = 0;
    }
  }

  calculateKickback () {
    if ( this.sprite.x > this.reticle.x ) {
      let difference = (this.sprite.x - this.reticle.x) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.x = difference * this.speed;
    } else {
      let difference = (this.reticle.x - this.sprite.x) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.x = -(difference * this.speed);
    }

    if ( this.sprite.y > this.reticle.y ) {
      let difference = (this.sprite.y - this.reticle.y) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.y = difference * this.speed;
    } else {
      let difference = (this.reticle.y - this.sprite.y) / 10;
      difference = difference > 10 ? 10 : difference;
      this.sprite.body.velocity.y = -(difference * this.speed );
    }
  }

/**
 * Steadily increasing velocity downward.
 */
  falling () {
    this.fallVelocity += 10;
    this.sprite.body.velocity.y = this.fallVelocity;
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
    console.log(this.health);
    // death animation
    // respawn?
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
