import { game } from '../game';

export class Move {

  constructor ({ character = {} } = {}) {
    this.game = game;
    this.character = character;
  }

  left () {
    if (this.character.sprite.scale.x > 0) {
      this.character.sprite.scale.x *= -1;
    }
    this.character.sprite.play('run');
    this.character.sprite.body.velocity.x = this.character.speed * -10;
    this.character.direction = 'left';
    this.updatePeer();
  }

  right () {
    if (this.character.sprite.scale.x < 0) {
      this.character.sprite.scale.x *= -1;
    }
    this.character.sprite.play('run');
    this.character.sprite.body.velocity.x = this.character.speed * 10;
    this.character.direction = 'right';
    this.updatePeer();
  }

  updatePeer () {
    if (this.character.peerConnection.connection) {
      this.character.peerConnection.send(this.character.positionPayload);
    }
  }

  idle () {
    this.character.sprite.frame = 5;
  }

}
