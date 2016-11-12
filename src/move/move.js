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
    if (this.character.peerConnection.connection) {
      this.character.peerConnection.send(this.character.positionPayload);
    }
  }

  idle () {}

}
