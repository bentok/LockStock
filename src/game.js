import { World, LAND_SCALE } from './world/world';
import { Sprites } from './sprites/sprites'

/**
 * Bootstraps the game and execute Phaser lifecycle hooks
 */
export const game = new Phaser.Game(4900 * LAND_SCALE, 3360 * LAND_SCALE, Phaser.AUTO, '', { preload, create, update, render });

let world;

/**
 * preload
 */
function preload () {
  game.time.advancedTiming = true; //Allows for FPS Meter
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  game.stage.backgroundColor = '#2d2d2d';

  game.playerLayer = game.add.group();
  game.landLayer = game.add.group();
  game.uiLayer = game.add.group();

  game.world.bringToTop(game.playerLayer);
  game.world.bringToTop(game.uiLayer);

  new Sprites().load();

  world = new World();
}
/**
 * create
 */
function create () {
  game.physics.startSystem(Phaser.Physics.ARCADE);
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

/**
 * Adds fps meter to top left
 */
function render () {
  game.debug.text(game.time.fps, 2, 14, '#00ff00');
}
