class PathFindingScene extends Phaser.Scene {
    /** @type {Phaser.Tilemaps.Tilemap} */
    map
    /** @type {Player} */
    player
    /** @type  {Phaser.Physics.Arcade.Sprite} */
    gun
    /** @type {Array.<Enemy>} */
    enemies = []
    /** @type {Array.<object>} */
    enemySpawnPoints = []
    /** @type {Enemy} */
    activeEnemy
    /** @type {number} */
    minEnemies = 2
    /** @type  {Phaser.Physics.Arcade.Group} */
    bullets
    
    constructor() {
        super({ key: 'pathFindingScene' })
    }
    
    preload() {
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
        this.load.tilemapTiledJSON('level1', 'assets/level1.json')
    }

    create() {
        this.map = this.make.tilemap({ key: 'level1' })
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        const tileset = this.map.addTilesetImage('tileset', 'tileset')
        const groundAndWallsLayer = this.map.createLayer('groundAndWallsLayer', 'tileset', 0, 0)
    }

    findPath(point) {
    }

    moveEnemy(path) {
    }

    onEnemySpawn() {
    }

    handleEnemyMove(enemy) {
    }

    collectGun(player, gun) {
    }
    
    fireBullet() {
    }

    worldBoundsBullet(body) {
    }

    bulletHitWall(bullet, layer) {
    }

    bulletHitEnemy(enemySprite, bullet) {
    }

    collideEnemy(player, sprite) {
    }

    update(time, delta) {
    }
}