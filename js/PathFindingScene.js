class PathFindingScene extends Phaser.Scene {
    /** @type {Phaser.Tilemaps.Tilemap} */
    map
    /** @type {Player} */
    player
    /** @type  {Phaser.Physics.Arcade.Sprite} */
    gun
    /** @type {Phaser.Physics.Arcade.Sprite} */
    redJewel
    /** @type {Phaser.Physics.Arcade.Sprite} */
    greenJewel
    /** @type {Phaser.Physics.Arcade.Sprite} */
    blueJewel
    /** @type {Phaser.Physics.Arcade.Sprite} */
    yellowJewel
    /** @type {Array.<Enemy>} */
    enemies = []
    /** @type {Array.<object>} */
    enemySpawnPoints = []
    /** @type {Enemy} */
    activeEnemy
    /** @type {number} */
    minEnemies = 2
    /** @type {number} */
    jewelsCollected = 0
    /** @type {number} */
    enemiesKilled = 0
    /** @type  {Phaser.Physics.Arcade.Group} */
    bullets

    constructor(id) {
        super(id)
    }

    preload() {
        //-- Tilemap and Tileset --//
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
        this.load.tilemapTiledJSON('testing', 'assets/level1.json')
        //-- Level 1 --//
        this.load.tilemapTiledJSON('level1', 'assets/levels_json/gameLevel1.json')
        //-- Level 2 --//
        this.load.tilemapTiledJSON('level2', 'assets/levels_json/gameLevel2.json')
        //-- Level 3 --//
        this.load.tilemapTiledJSON('level3','assets/levels_json/gameLevel3.json')
        //-- Level 4 --//
        this.load.tilemapTiledJSON('level4', 'assets/levels_json/gameLevel4.json')
        //-- Player --//
        this.load.image('man', 'assets/man.png')
        this.load.image('man-with-gun', 'assets/man-with-gun.png')
        //-- Enemy --//
        this.load.image('enemy', 'assets/enemy.png')
        this.load.image('dead-enemy', 'assets/dead-enemy.png')
        //-- Gun --//
        this.load.image('gun', 'assets/gun.png')
        this.load.image('bullet', 'assets/bullet.png')
        //-- Jewels --//
        this.load.image('blue-jewel', 'assets/blue-jewel.png')
        this.load.image('green-jewel', 'assets/green-jewel.png')
        this.load.image('red-jewel', 'assets/red-jewel.png')
        this.load.image('yellow-jewel', 'assets/yellow-jewel.png')
        //-- UI Stuff --//
        this.load.image('red-jewel-ui', 'assets/red-jewel-ui.png')
        this.load.image('blue-jewel-ui', 'assets/blue-jewel-ui.png')
        this.load.image('green-jewel-ui', 'assets/green-jewel-ui.png')
        this.load.image('yellow-jewel-ui', 'assets/yellow-jewel-ui.png')
        this.load.image('check', 'assets/check.png')
    }

    update(time, delta) {
        this.player.update(time, delta)
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(time, delta)
        }
    }
}