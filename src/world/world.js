import { game } from '../game';
import { Player } from '../Player/Player'

export class World {
    constructor() {
        this.game = game;
        console.log('new World');
        this.player = new Player();
    }
}