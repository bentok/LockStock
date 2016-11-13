import { game } from '../game';
import { Player, Enemy } from '../player';
import { Map1Json } from '../maps/Level1/map';
import { Sprites } from '../sprites/sprites';
import { GravityPad } from '../gravityPad/gravityPad';
import { PowerUp } from '../powerUp/powerUp';

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
    this.user = new Player({
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

    this.gravityPads.push( new GravityPad({
      x: 500,
      y: 342,
      type: 'antiGravity'
    }) );

    this.gravityPads.push( new GravityPad({
      x: 718,
      y: 380,
      type: 'left',
      angle: 45
    }) );

    this.gravityPads.push( new GravityPad({
      x: 290,
      y: 380,
      type: 'right',
      angle: -45
    }) );

    this.gravityPads.push( new GravityPad({
      x: 500,
      y: 414,
      type: 'up',
      angle: 180
    }) );

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

  removeGravity () {
    this.game.physics.p2.gravity.y = 0;
    this.gravityTimer = this.game.time.now + 5000;
  }

  gravityCycle () {
    if ( this.gravityTimer < this.game.time.now ) {
      if ( this.game.physics.p2.gravity.y !== 400 || this.game.physics.p2.gravity.x !== 0 ) {
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.gravity.x = 0;
      }
    }
  }

  changeGravityDirection(newDirection) {
    this.gravityTimer = this.game.time.now + 5000;
    switch ( newDirection ) {
      case 'up' :
        this.game.physics.p2.gravity.y = -400;
        this.game.physics.p2.gravity.x = 0;
        break;
      case 'right' :
        this.game.physics.p2.gravity.y = 0;
        this.game.physics.p2.gravity.x = 400;
        break;
      case 'left' :
        this.game.physics.p2.gravity.y = 0;
        this.game.physics.p2.gravity.x = -400;
        break;
      case 'antiGravity' :
        this.game.physics.p2.gravity.y = 0;
        this.game.physics.p2.gravity.x = 0;
        break;
      default :
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.gravity.x = 0;
    }
  }

  makeWater () {
    this.water = this.game.add.tileSprite(0, WORLD_HEIGHT * LAND_SCALE - 100, 128 * 16, 24 * 16, 'waters');

    this.water.animations.add('waves0', [0, 1, 2, 3, 2, 1]);
    this.water.animations.add('waves1', [4, 5, 6, 7, 6, 5]);
    this.water.animations.add('waves2', [8, 9, 10, 11, 10, 9]);
    this.water.animations.add('waves3', [12, 13, 14, 15, 14, 13]);
    this.water.animations.add('waves4', [16, 17, 18, 19, 18, 17]);
    this.water.animations.add('waves5', [20, 21, 22, 23, 22, 21]);
    this.water.animations.add('waves6', [24, 25, 26, 27, 26, 25]);
    this.water.animations.add('waves7', [28, 29, 30, 31, 30, 29]);

    let n = 7;
    this.water.animations.play(`waves${n}`, 8, true);
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
