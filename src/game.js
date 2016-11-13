import { World, LAND_SCALE, WORLD_WIDTH, WORLD_HEIGHT } from './world/world';
import { Sprites } from './sprites/sprites';

/**
 * Bootstraps the game and execute Phaser lifecycle hooks
 */
export const game = new Phaser.Game(WORLD_WIDTH * LAND_SCALE, WORLD_HEIGHT * LAND_SCALE, Phaser.AUTO, '', { preload, create, update, render });

export let world;

/**
 * preload
 */
function preload () {
  game.time.advancedTiming = true; // Allows for FPS Meter
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;

  //game.input.onDown.add(() => game.scale.startFullScreen(false), this);

  game.stage.backgroundColor = '#2d2d2d';

  game.playerLayer = game.add.group();
  game.landLayer = game.add.group();
  game.gravityPadsLayer = game.add.group();
  game.uiLayer = game.add.group();

  game.world.bringToTop(game.gravityPadsLayer);
  game.world.bringToTop(game.landLayer);

  game.world.bringToTop(game.playerLayer);
  game.world.bringToTop(game.uiLayer);

  new Sprites().load();

  getPeerKey(() => {
    world = new World();
  });
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


function getPeerKey (cb) {
  const peerKeyRequest = new XMLHttpRequest();
  peerKeyRequest.onreadystatechange = function (data, err) {
    if (peerKeyRequest.readyState === XMLHttpRequest.DONE) {
      game.peerApiKey = JSON.parse(peerKeyRequest.responseText).apiKey;
      cb();
    }
  };

  peerKeyRequest.open('GET', '/peerKey');
  peerKeyRequest.setRequestHeader('Accept', 'application/json');
  peerKeyRequest.send();
}
