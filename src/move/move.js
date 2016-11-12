import { game } from '../game';

export class Move {

  constructor ({ character = {} } = {}) {
    this.game = game;
    this.character = character;
  }

  left () {
    this.character.sprite.body.velocity.x = this.character.speed * -10;
    this.character.direction = 'left';
  }

  right () {
    this.character.sprite.body.velocity.x = this.character.speed * 10;
    this.character.direction = 'right';
  }

  idle () {
    // this.character.sprite.body.velocity.x = 0;
    // this.character.sprite.body.velocity.y = 0;
  }

}
