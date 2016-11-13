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
  game.stage.disableVisibilityChange = true;


  game.load.audio('music', '/music/song1.mp3');
  game.load.audio('death1', '/sounds/death1.wav');
  game.load.audio('death2', '/sounds/death2.wav');
  game.load.audio('normalshot', '/sounds/normalshot.wav');
  game.load.audio('bigshot', '/sounds/bigshot.wav');
  game.load.audio('fastshot', '/sounds/fastshot.wav');

  game.load.image('backdrop', `images/world_backgrounds/${Math.floor(Math.random() * 8) + 1}.jpg`);

  game.backdropLayer = game.add.group();
  game.playerLayer = game.add.group();
  game.projectilesLayer = game.add.group();
  game.landLayer = game.add.group();
  game.gravityPadsLayer = game.add.group();
  game.uiLayer = game.add.group();
  game.boundaryLayer = game.add.group();

  game.world.bringToTop(game.gravityPadsLayer);
  game.world.bringToTop(game.landLayer);

  game.world.bringToTop(game.playerLayer);
  game.world.bringToTop(game.projectilesLayer);
  game.world.bringToTop(game.boundaryLayer);
  game.world.bringToTop(game.uiLayer);
  // game.world.bounds = new Phaser.Rectangle(50, 0, LAND_SCALE * WORLD_WIDTH - 100, LAND_SCALE * WORLD_HEIGHT);

  new Sprites().load();

  getPeerKey(() => {
    world = new World();
  });
}
/**
 * create
 */
function create () {
  game.music = game.add.audio('music', 0.25, true);
  game.music.play();
  game.deathOne = game.add.audio('death1', 1);
  game.deathTwo = game.add.audio('death2', 1);
  game.normalShot = game.add.audio('normalshot', 0.3);
  game.bigShot = game.add.audio('bigshot', 0.3);
  game.fastShot = game.add.audio('fastshot', 0.3);
  const backdrop = game.add.tileSprite(0, 0, 1024, 1024, 'backdrop');
  game.backdropLayer.add(backdrop);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.setImpactEvents(true);

  const textStyles = {
    fill: '#00ff00',
    fontSize: '14px',
    font: 'Courier'
  };
  const muteText = game.add.text(WORLD_WIDTH * LAND_SCALE - 3, 40, 'M - Toggle Mute', textStyles);

  muteText.anchor.x = 1;
  muteText.anchor.y = 1;

  const mute = game.input.keyboard.addKey(Phaser.Keyboard.M);
  mute.onDown.add(() => {
    game.music.mute = !game.music.mute;
  }, this);


  const fullScreenText = game.add.text(WORLD_WIDTH * LAND_SCALE - 3, 56, 'F - Toggle Fullscreen', textStyles);

  const fullScreen = game.input.keyboard.addKey(Phaser.Keyboard.F);
  fullScreenText.anchor.x = 1;
  fullScreenText.anchor.y = 1;
  fullScreen.onDown.add(() => {
    game.scale.startFullScreen(false);
  });

  game.input.mouse.capture = true;

  world.setup();

  const topBoundary = this.game.add.bitmapData(WORLD_WIDTH, 30);
  topBoundary.ctx.rect(0, 0, WORLD_WIDTH, 30);
  topBoundary.ctx.fillStyle = '#222222';
  topBoundary.ctx.fill();
  this.topBoundary = this.game.boundaryLayer.create(0, 0, topBoundary);
  game.physics.p2.enable(this.topBoundary, false, true);
  this.topBoundary.body.kinematic = true;

  const leftBounary = this.game.add.bitmapData(30, WORLD_HEIGHT - 30);
  leftBounary.ctx.rect(0, 0, 30, WORLD_HEIGHT);
  leftBounary.ctx.fillStyle = '#222222';
  leftBounary.ctx.fill();
  this.leftBounary = this.game.boundaryLayer.create(0, 0, leftBounary);
  game.physics.p2.enable(this.leftBounary, false, true);
  this.leftBounary.body.kinematic = true;

  const rightBoundary = this.game.add.bitmapData(30, WORLD_HEIGHT - 30);
  rightBoundary.ctx.rect(0, 0, 30, WORLD_HEIGHT);
  rightBoundary.ctx.fillStyle = '#222222';
  rightBoundary.ctx.fill();
  this.rightBoundary = this.game.boundaryLayer.create(980, 0, rightBoundary);
  game.physics.p2.enable(this.rightBoundary, false, true);
  this.rightBoundary.body.kinematic = true;
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
