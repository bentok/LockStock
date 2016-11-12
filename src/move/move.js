import { game } from '../game';

export class Move {

  constructor ({ character } = {}) {
    this.game = game;
    this.character = character;
  }

  left () {
    this.character.sprite.body.velocity.set(this.character.speed * -20, 0);
    this.character.direction = 'left';
  }

  right () {
    this.character.sprite.body.velocity.set(this.character.speed * 20, 0);
    this.character.direction = 'right';
  }

  idle () {
    this.character.sprite.body.velocity.set(0, 0);
  }

}