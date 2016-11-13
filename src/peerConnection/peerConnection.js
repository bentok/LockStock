import { PLAYER_SCALE } from '../player/player';
import { LAND_SCALE } from '../world/world';
/**
 * Wrapper class for peerJS peer.
 */
export class PeerConnection {
  constructor (peerInstance, parentPlayer) {
    this.peer = peerInstance;
    this.parentPlayer = parentPlayer;

    this.id = new Promise((resolve, reject) => {
      if (!!this._id) {
        return resolve(this._id);
      }
      this.peer.on('open', (id) => {
        this._id = id;
        return resolve(id);
      });

    });

    this.peer.on('connection', (conn) => {
      this.connection = new Connection(conn, this.parentPlayer);
      console.info('Connection initiated with', this.connection);
    });
  }

  connect (opponentId) {
    this.connection = new Connection(this.peer.connect(opponentId), this.parentPlayer);
    console.info('Connection initiated with', this.connection);
  }

  send (payload) {
    this.connection.send(payload);
  }

}
class Connection {
  constructor (conn, parentPlayer) {
    this.connection = conn;
    this.parentPlayer = parentPlayer;

    this.connection.on('data', (data) => {
      switch (data.type) {
      case 'INITIAL_OPPONENT_POSITION':
        this.parentPlayer.addOpponent(data.position);
        break;
      case 'OPPONENT_POSITION':
        this.parentPlayer.opponent.updatePositionAndVelocity(data.position, data.velocity);
        break;
      case 'OPPONENT_AIM_FLIP':
        this.parentPlayer.opponent.look(data.aimDirection);
        break;
      }
    });

    this.connection.on('open', (data) => {
      const initialPostionPayload = this.parentPlayer.positionPayload;
      initialPostionPayload.type = 'INITIAL_OPPONENT_POSITION';
      this.send(initialPostionPayload);
    });
  }

  send (payload) {
    this.connection.send(payload);
  }
}
