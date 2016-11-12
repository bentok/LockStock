/**
 * Wrapper class for peerJS peer.
 */
export class PeerConnection {
  constructor (peerInstance) {
    this.peer = peerInstance;

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
      this.connection = new Connection(conn);
      console.info('Connection initiated with', this.connection);
    });
  }

  connect (opponentId) {
    this.connection = new Connection(this.peer.connect(opponentId));
    console.info('Connection initiated with', this.connection);
  }

  send (payload) {
    this.connection.send(payload);
  }

}
class Connection {
  constructor (conn) {
    this.connection = conn;

    this.connection.on('data', (data) => {
      console.info('Data received', data);
    });
  }

  send (payload) {
    this.connection.send(payload);
  }
}
