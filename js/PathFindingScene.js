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
        //-- Tilemap and Tileset --//
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
        this.load.tilemapTiledJSON('level1', 'assets/level1.json')
        //-- Player --//
        this.load.image('man', 'assets/man.png')
        this.load.image('man-with-gun', 'assets/man-with-gun.png')
        //-- Enemy --//
        this.load.image('enemy', 'assets/enemy.png')
        this.load.image('dead-enemy', 'assets/dead-enemy.png')
        //-- Gun --//
        this.load.image('gun', 'assets/gun.png')
        this.load.image('bullet', 'assets/bullet.png')
    }

    create() {
        //-- Creating Map --//
        this.map = this.make.tilemap({ key: 'level1' })
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        const tileset = this.map.addTilesetImage('tileset', 'tileset')
        const groundAndWallsLayer = this.map.createLayer('groundAndWallsLayer', 'tileset', 0, 0)
        groundAndWallsLayer.setCollisionByProperty({ valid: false })
        const objectLayer = this.map.getObjectLayer('objectLayer')
        //-- Creating Player --//
        objectLayer.objects.forEach(function (object) {
            let dataObject = Utils.RetrieveCustomProperties(object)
            if (dataObject.type === 'playerSpawn') {
                this.player = new Player(this, dataObject.x, dataObject.y, 'man')
            } else if (dataObject.type === 'gunSpawn') {
                // @ts-ignore
                this.gun = this.physics.add.sprite(dataObject.x, dataObject.y, 'gun')
            } else if (dataObject.type === 'enemySpawn') {
                //@ts-ignore
                this.enemySpawnPoints.push(dataObject)
            }
        }, this)
        this.physics.add.collider(this.player.sprite, groundAndWallsLayer)
        this.physics.add.overlap(this.player.sprite, this.gun, this.collectGun, null, this)
        //-- Bullet Group --//
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 5,
            collideWorldBounds: true
        })
        this.physics.world.on('worldbounds', this.worldBoundsBullet, this)
        this.physics.add.collider(this.bullets, groundAndWallsLayer, this.bulletHitWall, null, this)
        this.events.on('firebullet', this.fireBullet, this)
        //-- Enemies --//
        this.events.on('enemyready', this.handleEnemyMove, this)
        this.time.delayedCall(1000, this.onEnemySpawn, [], this)
        //@ts-ignore
        this.finder = new EasyStar.js()
        //-- Create 2D Representation of the map --//
        let grid = []
        for (let y = 0; y < this.map.height; y++) {
            let col = []
            for (let x = 0; x < this.map.width; x++) {
                //-- In Each Cell Store Tile ID --//
                let tile = this.map.getTileAt(x, y)
                if (tile) {
                    col.push(tile.index)
                } else {
                    col.push(0)
                }
            }
            grid.push(col)
        }
        //-- Tell EasyStar about Map --//
        this.finder.setGrid(grid)
        //-- Get Tileset Properties --//
        let properties = tileset.tileProperties
        console.log(tileset)
        //-- Array to hold Valid Tile IDs --//
        let acceptableTiles = []
        //-- Iterate through Tiles in the Tileset --//
        for (let i = tileset.firstgid - 1; i < tileset.total; i++) {
            if (properties[i] && properties[i].valid) {
                acceptableTiles.push(i + 1)
            }
        }
        //-- Which Tiles Can Be Used By EasyStar --//
        this.finder.setAcceptableTiles(acceptableTiles)
    }

    findPath(point) {
        //-- Point Object Has X and Y in Pixels --//
        let toX = Math.floor(point.x / this.map.tileWidth)
        let toY = Math.floor(point.y / this.map.tileHeight)
        let fromX = Math.floor(this.activeEnemy.sprite.x / this.map.tileWidth)
        let fromY = Math.floor(this.activeEnemy.sprite.y / this.map.tileHeight)
        let callback = this.moveEnemy.bind(this)
        //-- Set Up Path Query --//
        this.finder.findPath(fromX, fromY, toX, toY, function (path) {
            if (path === null) {
                console.warn('path not found')
            } else {
                console.log('Path found')
                callback(path)
            }
        })
        //-- Execute Path Query --//
        this.finder.calculate()
    }

    moveEnemy(path) {
        console.log(path)
    }

    onEnemySpawn() {
        //console.log('enemy spawned')
        let index = Phaser.Math.Between(0, this.enemySpawnPoints.length - 1)
        let spawnPoint = this.enemySpawnPoints[index]
        let enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, 'enemy')
        enemy.targetX = spawnPoint.x
        enemy.targetY = spawnPoint.y
        this.enemies.push(enemy)
        this.physics.add.overlap(this.player.sprite, enemy.sprite, this.collideEnemy, null, this)
    }

    handleEnemyMove(enemy) {
        this.activeEnemy = enemy
        let toX = Math.floor(this.player.sprite.x / this.map.width) * this.map.tileWidth + (this.map.tileWidth / 2)
        let toY = Math.floor(this.player.sprite.y / this.map.height) * this.map.tileHeight + (this.map.tileHeight / 2)
        this.findPath({ x: this.player.sprite.x, y: this.player.sprite.y })
    }

    collectGun(player, gun) {
        this.gun.destroy()
        this.player.hasGun = true
        this.player.sprite.setTexture('man-with-gun')
    }

    fireBullet() {
        let vector = new Phaser.Math.Vector2(48, 19)
        vector.rotate(this.player.sprite.rotation)
        let bullet = this.bullets.get(this.player.sprite.x + vector.x, this.player.sprite.y + vector.y)
        if (bullet) {
            bullet.setDepth(3)
            bullet.body.collideWorldBounds = true
            bullet.body.onWorldBounds = true
            bullet.enableBody(false, bullet.x, bullet.y, true, true)
            bullet.rotation = this.player.sprite.rotation
            this.physics.velocityFromRotation(bullet.rotation, 200, bullet.body.velocity)
        }
    }

    worldBoundsBullet(body) {
        //-- Return Bullet To the Pool --//
        body.gameObject.disableBody(true, true)
    }

    bulletHitWall(bullet, layer) {
        bullet.disableBody(true, true)
    }

    bulletHitEnemy(enemySprite, bullet) {
    }

    collideEnemy(player, sprite) {
    }

    update(time, delta) {
        this.player.update(time, delta)
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(time, delta)
        }
    }
}