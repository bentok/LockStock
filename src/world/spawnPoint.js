export class SpawnPoints {
  constructor () {
    this.spawnPoints = [
      {
        x: 300,
        y: 180
      },
      {
        x: 600,
        y: 150
      },
      {
        x: 750,
        y: 220
      },
      {
        x: 310,
        y: 250
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
