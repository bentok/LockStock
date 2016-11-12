import { World } from './world/world';
import { Sprites } from './Sprites/Sprites'

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
  // game.stage.backgroundColor = '#2d2d2d';

<<<<<<< 0245e2262fe448d3eacf99bd9bd17c596171a95f
  game.stage.backgroundColor = '#2d2d2d';

  game.load.tilemap('level1', 'maps/Level1/map.json', null, Phaser.Tilemap.TILED_JSON);

  game.load.image('Tiles', 'images/tile_sprites.png');
=======
  game.playerLayer = game.add.group();

  game.world.bringToTop(game.playerLayer);


  new Sprites().load();
>>>>>>> Player progress. not showing assets
}
/**
 * create
 */
function create () {

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