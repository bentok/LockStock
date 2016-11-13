import { game } from '../game';

const INDICATOR_SCALE = 0.3;

export class PowerIndicator {
  constructor({ width = 200, height = 20 } = {}) {
    this.game = game;
    this.containerWidth = width;
    this.containerHeight = height;

    this.indicators = {};
  }

  render () {
    const powerUpInfoContainer = this.game.add.bitmapData(this.containerWidth, this.containerHeight);
    powerUpInfoContainer.ctx.rect(0, 0, this.containerWidth, this.containerHeight);
    powerUpInfoContainer.ctx.fillStyle = '#AAAAAA';
    powerUpInfoContainer.ctx.fill();
    this.game.uiLayer.create(20, 30, powerUpInfoContainer);


    this.indicators.autofire = this.game.uiLayer.create(32, 40, 'power-up', 6);
    this.indicators.dblshot = this.game.uiLayer.create(62, 42, 'power-up', 11);
    this.indicators.highAcuracy = this.game.uiLayer.create(88, 40, 'power-up', 7);

    this.indicators.autofire.anchor.x = 0.5;
    this.indicators.autofire.anchor.y = 0.5;
    this.indicators.dblshot.anchor.x = 0.5;
    this.indicators.dblshot.anchor.y = 0.5;
    this.indicators.highAcuracy.anchor.x = 0.5;
    this.indicators.highAcuracy.anchor.y = 0.5;
    this.indicators.autofire.scale.setTo(INDICATOR_SCALE, INDICATOR_SCALE);
    this.indicators.dblshot.scale.setTo(INDICATOR_SCALE, INDICATOR_SCALE);
    this.indicators.highAcuracy.scale.setTo(INDICATOR_SCALE, INDICATOR_SCALE);

    this.toggleAllOff();

  }

  togglePowerOn(powerId) {
    if( this.indicators[powerId] ) {
      this.indicators[powerId].alpha = 1;
    }
  }

  toggleAllOff() {
    for (const power in this.indicators) {
      this.indicators[power].alpha = 0.2;
    }
  }

}