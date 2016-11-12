import { game } from '../game';

/**
 * Sprite registration
 */
export class Sprites {

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
    this.game.load.image('bullet', './images/bullet.png');

  }

}
