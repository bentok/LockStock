const LEFT_SPAWN = [
  {
    key: 'topLeft',
    x: 300,
    y: 165
  },
  {
    key: 'leftEdge',
    x: 310,
    y: 235
  },
  {
    key: 'leftMiddle',
    x: 340,
    y: 320
  }
];
const RIGHT_SPAWN = [
  {
    key: 'topRight',
    x: 600,
    y: 135
  },
  {
    key: 'midRight',
    x: 750,
    y: 205
  },
  {
    key: 'rightEdge',
    x: 600,
    y: 320
  }
];
const ALL_SPAWN = LEFT_SPAWN.concat(RIGHT_SPAWN);
export class SpawnPoints {
  static getSpawnPoint () {
    return ALL_SPAWN[Math.floor(Math.random() * ALL_SPAWN.length)];
  }
  static getLeftSpawnPoint () {
    return LEFT_SPAWN[Math.floor(Math.random() * LEFT_SPAWN.length)];
  }
  static getRightSpawnPoint () {
    return RIGHT_SPAWN[Math.floor(Math.random() * RIGHT_SPAWN.length)];
  }

}
