export class SpawnPoints {
  constructor () {
    this.spawnPoints = [
      {
        x: 300,
        y: 165
      },
      {
        x: 600,
        y: 135
      },
      {
        x: 750,
        y: 205
      },
      {
        x: 310,
        y: 235
      },
      {
        x: 340,
        y: 320
      },
      {
        x: 600,
        y: 320
      }
    ];
  }

  getSpawnPoint () {
    const index = this.getRandomArbitrary(0, 5);
    return this.spawnPoints[index];
  }

  getRandomArbitrary (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
