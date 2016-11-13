import { game } from '../game';

export class Move {

  constructor ({ character = {} } = {}) {
    this.game = game;
    this.character = character;
  }

  left () {
//     if (this.character.sprite.scale.x > 0) {
//       this.character.sprite.scale.x *= -1;
//     }
    this.character.sprite.play('run');
    this.character.sprite.body.velocity.x = this.character.speed * -10;
    this.character.direction = 'left';
    this.updatePeer();
  }

  right () {
//    if (this.character.sprite.scale.x < 0) {
//      this.character.sprite.scale.x *= -1;
//    }
    this.character.sprite.play('run');
    this.character.sprite.body.velocity.x = this.character.speed * 10;
    this.character.direction = 'right';
    this.updatePeer();
  }

  airborne () {
    this.character.sprite.play('jump');
  }

  updatePeer () {
    if (this.character.peerConnection.connection) {
      this.character.peerConnection.send(this.character.positionPayload);
    }
  }

  idle () {
    this.character.sprite.play('idle');
  }

  canJump () {
    const yAxis = p2.vec2.fromValues(0, 1);
    let result = false;
    for (let i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
      const c = game.physics.p2.world.narrowphase.contactEquations[i];
      if (c.bodyA === this.character.sprite.body.data || c.bodyB === this.character.sprite.body.data) {
        let d = p2.vec2.dot(c.normalA, yAxis);
        if (c.bodyA === this.character.sprite.body.data) {
          d *= -1;
        }
        if (d > 0.5) {
          result = true;
        }
      }
    }
    return result;
  }
}
