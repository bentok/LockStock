import { World } from './world/world';

/**
 * Bootstraps the game and execute Phaser lifecycle hooks
 */
export const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', { preload, create, update });

let world;

/**
 * preload
 */
function preload () {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = '#2d2d2d';

  game.load.tilemap('level1', 'maps/Level1/map.json', null, Phaser.Tilemap.TILED_JSON);

  game.load.image('Tiles', 'images/tile_sprites.png');
}
/**
 * create
 */
function create () {
  // game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);

  game.input.mouse.capture = true;

  world = new World();
}

/**
 * update
 */
function update () {
}
