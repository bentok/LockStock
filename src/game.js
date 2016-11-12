import { World } from './world/world';
import { Sprites } from './sprites/sprites'

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

  game.stage.backgroundColor = '#2d2d2d';
  game.load.tilemap('level1', 'maps/Level1/map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('Tiles', 'images/tile_sprites.png');

  game.playerLayer = game.add.group();

  game.world.bringToTop(game.playerLayer);

  new Sprites().load();

  world = new World();
}
/**
 * create
 */
function create () {

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);

  game.input.mouse.capture = true;

  world.setup();
}

/**
 * update
 */
function update () {
  world.update();
}