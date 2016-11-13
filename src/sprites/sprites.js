import { game } from '../game';

/**
 * Sprite registration
 */
const landSpriteTransformedValues = new Map([
      [104, 'Mid'],
      [0,   'Right'],
      [0,   'Left'],
      [153, 'Center'],
      [57,  'HalfMid'],
      [45,  'HalfRight'],
      [69,  'HalfLeft'],
      [81,  'Half'],
      [33,  'HillLeft'],
      [9,   'HillRight'],
      [21,  'HillLeft2'],
      [152, 'HillRight2']
]);

const landTypes = [
  'sand',
  'castle',
  'dirt',
  'snow',
  'stone'
];

export class Sprites {
  static get landSpriteTransformedValues () {
    return landSpriteTransformedValues;
  }
  static get landTypes() {
    return landTypes;
  }

  constructor () {
    this.game = game;
  }

  /**
   * Loads the sprite sheets to the game
   */
  load () {

    // Load player sprites
    this.game.load.spritesheet('greenPlayer', '/images/player_sprites/p1_spritesheet.png', 73, 95, 17);
    this.game.load.spritesheet('bluePlayer', '/images/player_sprites/p2_spritesheet.png', 73, 95, 17);
    this.game.load.spritesheet('pinkPlayer', '/images/player_sprites/p3_spritesheet.png', 73, 95, 17);
    this.game.load.image('greenPlayerInjured', '/images/player_sprites/p1_injured.png');
    this.game.load.image('bluePlayerInjured', '/images/player_sprites/p2_injured.png');
    this.game.load.image('pinkPlayerInjured', '/images/player_sprites/p3_injured.png');

    // Load images - arguments(name, path)
    this.game.load.spritesheet('star', `/images/bottom_sprites/star${Math.floor(Math.random() * 3) + 1}.png`, 32, 384);
    this.game.load.image('reticle', './images/reticle.png');
    this.game.load.image('player', './images/character.png');
    this.game.load.image('bullet', './images/bullet.png');
    this.game.load.spritesheet('rain', './images/rain.png', 17, 17);
    this.game.load.spritesheet('power-up', './images/power-up.svg', 73, 73, 12);
    this.game.load.image('blue_ball', './images/button_sprites/blue_ball.png', 17, 17);
    this.game.load.image('green_ball', './images/button_sprites/green_ball.png', 17, 17);
    this.game.load.image('red_ball', './images/button_sprites/red_ball.png', 17, 17);
    this.game.load.image('yellow_ball', './images/button_sprites/yellow_ball.png', 17, 17);

    // Gravity Buttons
    this.game.load.image('button_blue', './images/button_sprites/button_blue.png');
    this.game.load.image('button_blue_pressed', './images/button_sprites/button_blue_pressed.png');
    this.game.load.image('button_green', './images/button_sprites/button_green.png');
    this.game.load.image('button_green_pressed', './images/button_sprites/button_green_pressed.png');
    this.game.load.image('button_yellow', './images/button_sprites/button_yellow.png');
    this.game.load.image('button_yellow_pressed', './images/button_sprites/button_yellow_pressed.png');
    this.game.load.image('button_red', './images/button_sprites/button_red.png');
    this.game.load.image('button_red_pressed', './images/button_sprites/button_red_pressed.png');

    this.loadLand(Sprites.landTypes[Math.floor(Math.random() * Sprites.landTypes.length)]);

  }

  loadLand (landType) {
    this.game.load.image('Mid', `./images/tile_sprites/${landType}Mid.png`);
    this.game.load.image('Right', `./images/tile_sprites/${landType}Right.png`);
    this.game.load.image('Left', `./images/tile_sprites/${landType}Left.png`);

    this.game.load.image('Center', `./images/tile_sprites/${landType}Center.png`);

    this.game.load.image('Half', `./images/tile_sprites/${landType}Half.png`);
    this.game.load.image('HalfMid', `./images/tile_sprites/${landType}HalfMid.png`);
    this.game.load.image('HalfRight', `./images/tile_sprites/${landType}HalfRight.png`);
    this.game.load.image('HalfLeft', `./images/tile_sprites/${landType}HalfLeft.png`);

    this.game.load.image('HillLeft', `./images/tile_sprites/${landType}HillLeft.png`);
    this.game.load.image('HillRight', `./images/tile_sprites/${landType}HillRight.png`);
    this.game.load.image('HillLeft2', `./images/tile_sprites/${landType}HillLeft2.png`);
    this.game.load.image('HillRight2', `./images/tile_sprites/${landType}HillRight2.png`);
  }
}
