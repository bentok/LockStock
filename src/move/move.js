import { game } from '../game';

export class Move {

  constructor ({ character = {} } = {}) {
    this.game = game;
    this.character = character;
  }

  left () {
    this.character.sprite.body.velocity.x = this.character.speed * -10;
    this.character.direction = 'left';
    this.updatePeer();
  }

  right () {
    this.character.sprite.body.velocity.x = this.character.speed * 10;
    this.character.direction = 'right';
    this.updatePeer();
  }

  updatePeer () {
    if (this.character.peerConnection) {
      const payload = {
        type: 'OPPONENT_POSITION',
        velocity: {
          x: this.character.sprite.body.velocity.x,
          y: this.character.sprite.body.velocity.y,
          mx: this.character.sprite.body.velocity.mx,
          my: this.character.sprite.body.velocity.my,
        },
        position: {
          x: this.character.sprite.position.x,
          y: this.character.sprite.position.y
        }
      };
      this.character.peerConnection.send(payload);
    }
  }

  idle () {}

}
