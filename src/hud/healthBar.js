import { game } from '../game';

export class HealthBar {
  constructor({ character = {}, width = 200, height = 10 } = {}) {
    this.game = game;
    this.character = character;
    this.containerWidth = width;
    this.containerHeight = height;
    this.healthBarWidth = width - 4;
    this.healthBarHeight = height - 4;
  }

  render () {
    const healthBarContainer = this.game.add.bitmapData(this.containerWidth, this.containerHeight);
    healthBarContainer.ctx.rect(0, 0, this.containerWidth, this.containerHeight);
    healthBarContainer.ctx.fillStyle = '#cccccc';
    healthBarContainer.ctx.fill();

    const healthBar = this.game.add.bitmapData(this.healthBarWidth, this.healthBarHeight);
    healthBar.ctx.rect(0, 0, this.healthBarWidth, this.healthBarHeight);
    healthBar.ctx.fillStyle = '#9a3334';
    healthBar.ctx.fill();

    this.containerSprite = this.game.uiLayer.create(20, 20, healthBarContainer);
    this.healthSprite = this.game.uiLayer.create(22, 22, healthBar);

    this.lives = this.game.add.text(this.game.world.centerX, this.game.world.centerY, `Lives: ${ this.character.lives }`, { font: '16px Arial', fill: '#fff' });
  }

  update () {
    /**
     * Tweens the healthbar sprite.
     * Tween method arguments: (spriteToTween)
     * To method argumetns: (proptertiesToTween, durationInMilliSeconds, TransitionType, autoStart)
     */
    this.game.add.tween(this.healthSprite).to({ width: this.character.health / this.character.maxHealth * this.healthBarWidth }, 200, Phaser.Easing.Linear.None, true);
  }

}
