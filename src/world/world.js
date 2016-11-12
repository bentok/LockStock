import { game } from '../game';
import { Player, Enemy } from '../player';
import { Map1Json } from '../maps/Level1/map';
import { Sprites } from '../sprites/sprites';
import { GravityPad } from '../gravityPad/gravityPad';

export const LAND_SCALE = 0.2;
export const WORLD_WIDTH = 4900;
export const WORLD_HEIGHT = 3360;

export class World {

  static get LAND_SCALE () {
    return LAND_SCALE;
  }
  constructor () {
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
    this.user.id.then((id) => {
      const userIdText = this.game.add.text(WORLD_WIDTH * LAND_SCALE - 3, 24, id, userIdStyles);
      userIdText.anchor.x = 1;
      userIdText.anchor.y = 1;
      const urlQuery = window.location.search.slice(1);
      const idRegex = /id=(\w+)/;
      const idMatches = idRegex.exec(urlQuery);
      if (idMatches) {
        this.user.connect(idMatches[1]);
      } else {
        window.prompt( 'Copy to clipboard and send to opponent', `${window.location.host}?id=${id}`);
      }
    });

    this.gravityPads = [];
  }

  setup () {
    this.user.name = 'Player 1';
    this.user.render();

    this.buildMap();
    // Add Phisics to world and apply to all objects
    this.game.physics.p2.gravity.y = 0;
    this.game.physics.p2.restitution = 0.05;

    this.gravityPads.push( new GravityPad({
      x: 230,
      y: 190
    }) );

    this.gravityPads.push( new GravityPad({
      x: 800,
      y: 231
    }) );

    for (const pad of this.gravityPads) {
      pad.render();
    }

  }

  update () {
    for (const player of this.players) {
      player.update();
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
      default :
        this.game.physics.p2.gravity.y = 400;
        this.game.physics.p2.gravity.x = 0;
    }
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
    this.game.world.resize();
  }

  addOpponent (position) {
    const opponentPlayer = new Enemy(position);
    this.players.push(opponentPlayer);
    this.user.opponent = opponentPlayer;
    opponentPlayer.render();
  }
}
