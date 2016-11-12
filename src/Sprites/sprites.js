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
  'grass',
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

    // Load images - arguments(name, path)
    this.game.load.image('reticle', './images/reticle.png');
    this.game.load.image('player', './images/character.png');
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
