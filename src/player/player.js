import { game, world } from '../game';
import { Death } from './death';
import { Move } from '../move/move';
import { Weapon } from '../weapon/weapon';
import { PeerConnection } from '../peerConnection/peerConnection';
import { HealthBar } from '../hud/healthBar';
import { PowerIndicator } from '../hud/powerIndicator';
import { LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from  '../world/world';
import { SpawnPoints } from '../world/spawnPoint';

/**
 * Define consts for use with Player
 */
export const RETICLE_SCALE = 0.5; // always half of LAND_SCALE
export const PLAYER_SCALE = 2; // 4 times LAND_SCALE
export const PLAYER_MAX_HEALTH = 500;
export const PLAYER_COLORS = [
  'green', 'blue', 'pink'
];

/**
 * Player
 * @class Player
 */
export class Player {

  static get PLAYER_COLORS () {
    return PLAYER_COLORS;
  }

  /**
   * @param {Number} health Current health of the character
   * @param {Number} maxHealth Maximum possible health for the character
   * @param {Number} speed Walking speed for character.
   * @param {Number} x X coordinate of spawn location. Defaults to center of world.
   * @param {Number} Y Y coordinate of spawn location. Defaults to center of world.
   */
  constructor ({ host = false, health = 500, speed = 10, hasAutoFire = false } = {}) {
    this.playerColor = PLAYER_COLORS[0];
    this.host = host;
    this.maxHealth = PLAYER_MAX_HEALTH;
    this.game = game;
    this.death = new Death({ character: this });
    this.weapon = new Weapon({ character: this });
    this.healthBar = new HealthBar({ character: this });
    this.powerIndicator = new PowerIndicator();
    this.aimDirection = 'right';
    this.jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.shootButton = game.input.activePointer.leftButton;
    this.peerConnection = new PeerConnection(new Peer({ key: this.game.peerApiKey }), this);
    this.lives = 5;
    this.spawnPoint = this.host ? SpawnPoints.getLeftSpawnPoint() : SpawnPoints.getRightSpawnPoint();
    setInterval(() => {
      if (this.peerConnection && this.peerConnection.connection) {
        this.peerConnection.send(this.positionPayload);
      }
    }, 50);

    /**
     * Preserves initial settings for restoring on respawn
     */
    this.spawnSettings = {
      hasAutoFire,
      health,
      speed,
    };

    /**
     * Character stats can have modifiers
     */
    this.hasAutoFire = hasAutoFire;
    this.health = health;
    this.speed = speed;
  }

  /**
   * Defines player stats to reset on respawn
   */
  respawn () {
    this.spawnPoint = SpawnPoints.getSpawnPoint();
    this.hasAutoFire = this.spawnSettings.hasAutoFire;
    this.health = this.spawnSettings.health;
    this.speed = this.spawnSettings.speed;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
    this.sprite.body.x = this.spawnPoint.x;
    this.sprite.body.y = this.spawnPoint.y;
    this.powerIndicator.toggleAllOff()
  }

/**
 * Render event in the Phaser cycle.
 */
  render () {
    this.healthBar.render();
    this.powerIndicator.render();
    this.sprite = this.game.playerLayer.create(this.spawnPoint.x, this.spawnPoint.y, `${this.playerColor}Player`);
    this.sprite.animations.add('run', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
    this.sprite.animations.add('injure', [7]);
    this.sprite.animations.add('idle', [5]);
    this.sprite.animations.add('jump', [9]);
    this.sprite.scale.setTo(PLAYER_SCALE * LAND_SCALE, PLAYER_SCALE * LAND_SCALE);
    this.sprite.anchor.setTo(0.5, 0.5);
    this.move = new Move({ character: this });

    // Applies p2 physics to player, and collision with world bounds
    this.game.physics.p2.enable(this.game.playerLayer, false, true);

    // Defines keyboard controls
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    // Detect contact with any other sprite. Perform actions based on name of sprite (body.sprite.key)
    this.sprite.body.onBeginContact.add(contact, this);
    function contact (body, bodyB, shapeA, shapeB, equation) {
      if ( body ) {
        if (body.sprite && body.sprite.key === 'bullet' ) {
          this.sprite.play('injure');
          const velocity = body.velocity.x > body.velocity.y ? body.velocity.x : body.velocity.y;
          this.subtractHealth(velocity * 0.04);
        }
        if (body.sprite && body.sprite.key === 'map' ) {
          this.standing = true;
        }
        if (body.sprite && body.sprite.key === 'power-up' ) {
          if ( body.active ) {
            let powerUpType = body.powerUpType;
            if ( this.peerConnection && this.peerConnection.connection ) {
              this.peerConnection.send({
                type: 'OPPONENT_POWER_UP',
                powerUpType
              });
            }
            this.addPowerUp(powerUpType);
          }
        }
      }
      this.standing = true;
    }

    this.sprite.body.fixedRotation = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.checkWorldBounds = true;

    this.weapon.render();

    this.setupReticle();
  }

  /**
   * Adds powerUp effects to user
   * @param {String} powerUpType Name of powerup
   */
  addPowerUp(powerUpType){
    switch ( powerUpType ) {
      case 'autofire':
        this.hasAutoFire = true;
        this.powerIndicator.togglePowerOn('autofire');
        break;
      case 'dblshot':
        this.weapon.doubleShot();
        this.powerIndicator.togglePowerOn('dblshot');
        break;
      case 'highAcuracy':
        this.weapon.highAcuracy();
        this.powerIndicator.togglePowerOn('highAcuracy');
        break;
      default:
        break;
    }
  }

  /**
   * Setup aiming reticle sprite
   */
  setupReticle () {
    this.reticle = this.game.uiLayer.create(this.spawnPoint.x, this.spawnPoint.y, 'reticle');
    this.game.physics.p2.enable(this.reticle, false);
    this.reticle.scale.setTo(RETICLE_SCALE * LAND_SCALE, RETICLE_SCALE * LAND_SCALE);
    this.game.input.addMoveCallback(this.moveReticle, this);

    this.reticle.body.static = true;
    this.reticle.body.kinematic = true;
    this.reticle.body.data.shapes[0].sensor = true;
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
    this.getAimDirection();
    this.checkForFallToDeath();
  }

  /**
   * Updates position and velocity of a body
   */
  updatePositionAndVelocity (position, velocity) {
    if (this.sprite.position.x > position.x) {
      this.aimDirection = 'right';
    } else {
      this.aimDirection = 'left';
    }
    this.sprite.position.x = position.x;
    this.sprite.position.y = position.y;
  }

  /**
   * Sets up player controlls and actions
   */
  playerControls () {
    // Keyboard controls
    const canJump = this.move.canJump();
    if (this.keys.left.isDown || this.wasd.left.isDown) {
      this.sprite.play('run');
      // Only run if touching ground
      if (canJump) {
        this.move.left();
      }
    } else if (this.keys.right.isDown || this.wasd.right.isDown) {
      this.sprite.play('run');
      // Only run if touching ground
      if (canJump) {
        this.move.right();
      }
    } else if (!this.move.canJump()) {
      this.move.airborne();
    }  else {
      this.move.idle();
    }

    // Shoot
    if (this.shootButton.isDown) {
      if (!this.followThrough) {
        const shot = this.weapon.fire({ aimX: this.reticle.body.x, aimY: this.reticle.body.y });
        if ( shot ) {
          this.weapon.calculateKickback();
        }
        if (!this.hasAutoFire) {
          this.followThrough = true;
        }
      }
    } else {
      this.followThrough = false;
    }

    // Jump
    if (this.jumpButton.isDown) {
      if (this.jumpTimer > this.game.time.now) {
        this.standing = false;
        this.sprite.body.velocity.y = this.speed * -10;
      } else if (this.move.canJump()) {
        this.jumpTimer = this.game.time.now + 250;
      }
    }
  }

  /**
   * Gets aim diirection. Used for sprite animation and origin position of bullets.
   */
  getAimDirection () {
    if ( this.sprite.x > this.reticle.x ) {
      this.aimDirection = 'left';
    } else {
      this.aimDirection = 'right';
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
    this.healthBar.update();
    if ( this.health <= 0 ) {
      this.death.subtractLife();
    }
  }

  /**
   * Checks if player has hit the bottom of the level
   */
  checkForFallToDeath () {
    if ( this.sprite.y >= WORLD_HEIGHT * LAND_SCALE - 20 ) {
      this.death.subtractLife();
    }
  }

  /**
   * On peer connection to oponent
   */
  connect (opponentId) {
    this.peerConnection.connect(opponentId);
  }

  /**
   * Add an opponent character to world
   */
  addOpponent (position) {
    world.addOpponent(position);
  }

  /**
   * On pressing gravity pad
   * @param {String} key Named gravity pad
   */
  pressGravityPad (key) {
    for (const pad of world.gravityPads) {
      if (pad.key === key) {
        world.changeGravityDirection(pad.type);
        pad.pressed = true;
        pad.emitter.on = false;
        break;
      }
    }
  }

  /**
   * Looks toward a direction
   * @param {String} direction Left or right
   */
  look ( direction ) {
    if (direction === 'left') {
      this.sprite.scale.x = PLAYER_SCALE * LAND_SCALE * -1;
    } else {
      this.sprite.scale.x = PLAYER_SCALE * LAND_SCALE;
    }
  }
  set aimDirection (aimDirection) {
    if (!this.sprite) {
      return;
    }
    this.look(aimDirection);
    if (this._aimDirection !== aimDirection && this.peerConnection && this.peerConnection.connection) {
      this.peerConnection.send({
        type: 'OPPONENT_AIM_FLIP',
        aimDirection
      });
    }
    this._aimDirection = aimDirection;
  }

  /**
   * Getter for aim direction for syncing with opponent
   */
  get aimDirection () {
    return this._aimDirection;
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

  /**
   * Getter for id for use with peer connections
   */
  get id () {
    return this.peerConnection.id;
  }

  /**
   * Grooms payload for sending to peer
   */
  get positionPayload () {
    if (this.sprite && this.sprite.body && this.sprite.position) {
      return {
        type: 'OPPONENT_POSITION',
        velocity: {
          x: this.sprite.body.velocity.x,
          y: this.sprite.body.velocity.y,
          mx: this.sprite.body.velocity.mx,
          my: this.sprite.body.velocity.my,
        },
        position: {
          x: this.sprite.position.x,
          y: this.sprite.position.y
        }
      };
    }
  }

}
