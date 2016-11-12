import { Player } from '.';

export class Enemy extends Player {
  constructor () {
    super(arguments);
    this.name = 'Enemy1';
  }
  update () {
    this.checkForFallToDeath();
    this.aimDirection();
  }
}
