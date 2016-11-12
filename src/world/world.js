import { game } from '../game';
import { Player } from '../player/player';
import { Map1Json } from '../maps/Level1/map';
import { Sprites } from '../sprites/sprites';

export class World {
  constructor () {
    this.game = game;
    console.log('new World');
    this.player = new Player();
  }

  setup () {
    this.player.render();

    this.buildMap();

  }

  update () {
    this.player.update();
  }

  buildMap () {
    console.log(Map1Json);
    const mapTilesArray = Map1Json.layers[0].data;
    const mapHeight = Map1Json.layers[0].height;
    const mapWidth = Map1Json.layers[0].width;
    const tileHeight = Map1Json.tilesets[0].tileheight;
    const tileWidth = Map1Json.tilesets[0].tilewidth;

    for (var y = 0; y < mapHeight; ++y) {
      for (var x = 0; x < mapWidth; ++x) {
        const currentTileArrayPosition = mapWidth*y+x;
        const currentTileType = mapTilesArray[currentTileArrayPosition];
        const currentTileX = x*70;
        const currentTileY = y*70;
        if((currentTileType) !== 0 && Sprites.landSpriteTransformedValues.has(currentTileType)){
          const newTile = this.game.landLayer.create(currentTileX, currentTileY, Sprites.landSpriteTransformedValues.get(currentTileType));
          this.game.physics.p2.enable(newTile,false);
          newTile.body.kinematic = true;
        } else {
          console.log(Sprites.landSpriteTransformedValues.get(currentTileType));
        }
      }
    }
    this.game.physics.p2.enable(this.game.landLayer, false);
    this.game.world.resize();
  }
}
