import { game } from '../game';
import { Player, Enemy } from '../player';
import { Map1Json } from '../maps/Level1/map';
import { Sprites } from '../sprites/sprites';
import { GravityPad } from '../gravityPad/gravityPad';
import { PowerUp } from '../powerUp/powerUp';
import { HealthBar } from '../hud/healthBar';

export const LAND_SCALE = 0.2;
export const WORLD_WIDTH = 4900;
export const WORLD_HEIGHT = 3360;

export class World {

  static get LAND_SCALE () {
    return LAND_SCALE;
  }
  constructor () {
    const urlQuery = window.location.search.slice(1);
    const idRegex = /id=(\w+)/;
    const idMatches = idRegex.exec(urlQuery);

    this.game = game;
    this.healthBar = new HealthBar();
    this.user = new Player({
      host: !idMatches, // If there's no id in the url, then it's the host
      x: 300,
      y: 170
    });
    this.players = [
      this.user
    ];
    this.gravityTimer = 0;

    const userIdStyles = {
      fill: '#00ff00',
      fontSize: '14px',
      font: 'Courier'
    };
    if (idMatches) {
      this.user.connect(idMatches[1]);
    }
    this.user.id.then((id) => {
      const userIdText = this.game.add.text(WORLD_WIDTH * LAND_SCALE - 3, 24, id, userIdStyles);
      userIdText.anchor.x = 1;
      userIdText.anchor.y = 1;
      if (!idMatches) {
        window.prompt( 'Copy to clipboard and send to opponent', `${window.location.host}?id=${id}`);
      }
    });

    this.gravityPads = [];
    this.powerUps = [];
  }

  setup () {
    this.makeWater();

    this.user.name = 'Player 1';
    this.user.render();

    this.buildMap();
    // Add Phisics to world and apply to all objects
    this.game.physics.p2.gravity.y = 0;
    this.game.physics.p2.restitution = 0.05;

    this.gravityPads.push(new GravityPad({
      key: 'antiGravity',
      x: 500,
      y: 333,
      type: 'antiGravity'
    }));

    this.gravityPads.push(new GravityPad({
      key: 'left',
      x: 727,
      y: 377,
      type: 'left',
      angle: 45
    }));

    this.gravityPads.push(new GravityPad({
      key: 'right',
      x: 282,
      y: 377,
      type: 'right',
      angle: -45
    }));

    this.gravityPads.push(new GravityPad({
      key: 'up',
      x: 500,
      y: 423,
      type: 'up',
      angle: 180
    }));

    for (const pad of this.gravityPads) {
      pad.render();
    }

    this.powerUps.push( new PowerUp({
      x: 460,
      y: 189,
      type: 'autofire'
    }) );

    this.powerUps.push( new PowerUp({
      x: 282,
      y: 470,
      type: 'dblshot'
    }) );

    this.powerUps.push( new PowerUp({
      x: 727,
      y: 468,
      type: 'highAcuracy'
    }) );


    for (const powerUp of this.powerUps) {
      powerUp.setup();
    }

  }

  update () {
    this.user.update();
    for (const powerUp of this.powerUps) {
      powerUp.render();
    }
    this.gravityCycle();
  }

  gravityCycle () {
    if ( this.gravityTimer < this.game.time.now ) {
      this.changeGravityDirection();
    }
  }

  changeGravityDirection (direction = 'default') {
    this.gravityTimer = this.game.time.now + 5000;
    for (const pad of this.gravityPads) {
      pad.pressed = false;
      pad.emitter.on = true;
    }
    const gravityValues = {
      'default': { x: 0, y: 400 },
      'up': { x: 0, y: -400 },
      'right': { x: 400, y: 0 },
      'left': { x: -400, y: 0 },
      'antiGravity': { x: 0, y: 5 }
    };

    this.game.physics.p2.gravity.x = gravityValues[direction].x;
    this.game.physics.p2.gravity.y = gravityValues[direction].y;
  }

  makeWater () {
    this.star = this.game.add.tileSprite(0, WORLD_HEIGHT * LAND_SCALE - 100, 128 * 16, 24 * 16, 'star');

    this.star.animations.add('waves', [0, 1, 2, 3, 4, 3, 2, 1]);

    this.star.animations.play(`waves`, 8, true);
  }

  buildMap () {
    const mapTilesArray = Map1Json.layers[0].data;
    const mapHeight = Map1Json.layers[0].height;
    const mapWidth = Map1Json.layers[0].width;
    const tileHeight = Map1Json.tilesets[0].tileheight;
    const tileWidth = Map1Json.tilesets[0].tilewidth;

    for (let y = 0; y < mapHeight; ++y) {
      for (let x = 0; x < mapWidth; ++x) {
        const currentTileArrayPosition = mapWidth * y + x;
        const currentTileType = mapTilesArray[currentTileArrayPosition];
        const currentTileX = x * (tileWidth * LAND_SCALE);
        const currentTileY = y * (tileHeight * LAND_SCALE);
        if (currentTileType !== 0 && Sprites.landSpriteTransformedValues.has(currentTileType)) {
          const newTile = this.game.landLayer.create(currentTileX, currentTileY, Sprites.landSpriteTransformedValues.get(currentTileType));
          newTile.scale.setTo(LAND_SCALE, LAND_SCALE);
          this.game.physics.p2.enable(newTile, false);
          newTile.body.kinematic = true;
        } // Else it's an empty space
      }
    }
    this.game.physics.p2.enable(this.game.landLayer, false);
  }

  addOpponent (position) {
    const opponentPlayer = new Enemy(position);
    this.players.push(opponentPlayer);
    if (this.user.opponent) {
      this.user.opponent.sprite.destroy();
    }
    this.user.opponent = opponentPlayer;
    opponentPlayer.render();
  }
}
