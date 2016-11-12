import { game } from '../game';
import { Player } from '../player/player'

export class World {
  constructor() {
    this.game = game;
    console.log('new World');
    this.player = new Player();
  }

  setup() {
    this.player.render();
  }

  update () {
    this.player.update();
  }
}