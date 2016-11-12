import { game } from '../game';
import { Player } from '../player/player';
import { Map1Json } from '../maps/Level1/map';
import { Sprites } from '../sprites/sprites';

export class World {
  constructor () {
    this.game = game;
    this.player = new Player();
    this.gravityTimer = 0;
  }

  setup () {
    this.player.render();

    this.buildMap();
    // Add Phisics to world and apply to all objects
    this.game.physics.p2.gravity.y = 400;
    this.game.physics.p2.restitution = 0.05;

  }

  update () {
    this.player.update();
    if ( this.gravityTimer < this.game.time.now ) {
      this.game.physics.p2.gravity.y = this.game.physics.p2.gravity.y === 0 ? 400 : 0;
      console.log(`Gravity Change!! -- new Value: ${ this.game.physics.p2.gravity.y }`);
      this.gravityTimer = this.game.time.now + 10000;
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
        const currentTileX = x * 70;
        const currentTileY = y * 70;
        if (currentTileType !== 0 && Sprites.landSpriteTransformedValues.has(currentTileType)) {
          const newTile = this.game.landLayer.create(currentTileX, currentTileY, Sprites.landSpriteTransformedValues.get(currentTileType));
          this.game.physics.p2.enable(newTile, false);
          newTile.body.kinematic = true;
        } // Else it's an empty space
      }
    }
    this.game.physics.p2.enable(this.game.landLayer, false);
    this.game.world.resize();
  }
}
