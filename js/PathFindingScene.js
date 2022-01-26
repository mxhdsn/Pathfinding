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

    constructor() {
        super({ key: 'pathFindingScene' })
    }

    preload() {
        //-- Tilemap and Tileset --//
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
        this.load.tilemapTiledJSON('testing', 'assets/level1.json')
        //-- Level 1 --//
        this.load.tilemapTiledJSON('level1', 'assets/gameLevel1.json')
        //-- Level 2 --//
        this.load.tilemapTiledJSON('level2', 'assets/gameLevel2.json')
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

    create() {
        //-- Creating Map --//
        this.map = this.make.tilemap({ key: 'level1' })
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
        const tileset = this.map.addTilesetImage('tileset', 'tileset')
        const groundAndWallsLayer = this.map.createLayer('groundAndWallsLayer', 'tileset', 0, 0)
        groundAndWallsLayer.setCollisionByProperty({ valid: false })
        const objectLayer = this.map.getObjectLayer('objectLayer')
        //-- Creating User Interface --//
        this.border = new Phaser.Geom.Rectangle(0, 0, 1997, 1997)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.border)
        //-- Jewels UI --//
        this.redJewelUI = this.add.image(70, 70, 'red-jewel-ui')
        this.redJewelText = this.add.text(130, 30, '=', {
            fontSize: '90px',
        })
        this.redJewelUI.setDepth(3)
        this.redJewelText.setDepth(3)
        this.check1 = this.add.image(230, 60, 'check')
        this.check1.setDepth(3)
        this.check1.setVisible(false)
        this.blueJewelUI = this.add.image(70, 170, 'blue-jewel-ui')
        this.blueJewelText = this.add.text(130, 130, '=', {
            fontSize: '90px',
        })
        this.blueJewelUI.setDepth(3)
        this.blueJewelText.setDepth(3)
        this.check2 = this.add.image(230, 160, 'check')
        this.check2.setDepth(3)
        this.check2.setVisible(false)
        this.greenJewelUI = this.add.image(70, 270, 'green-jewel-ui')
        this.greenJewelText = this.add.text(130, 230, '=', {
            fontSize: '90px',
        })
        this.greenJewelUI.setDepth(3)
        this.greenJewelText.setDepth(3)
        this.check3 = this.add.image(230, 260, 'check')
        this.check3.setDepth(3)
        this.check3.setVisible(false)
        this.yellowJewelUI = this.add.image(70, 370, 'yellow-jewel-ui')
        this.yellowJewelText = this.add.text(130, 330, '=', {
            fontSize: '90px',
        })
        this.yellowJewelUI.setDepth(3)
        this.yellowJewelText.setDepth(3)
        this.check4 = this.add.image(230, 360, 'check')
        this.check4.setDepth(3)
        this.check4.setVisible(false)
        //-- Enemies UI --//
        this.enemiesKilledText = this.add.text(70, 1930, 'Enemies Killed = 0 ', {
            fontSize: '50px'
        })
        this.enemiesKilledText.setDepth(3)
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
            } else if (dataObject.type === 'redSpawn') {
                // @ts-ignore
                this.redJewel = this.physics.add.sprite(dataObject.x, dataObject.y, 'red-jewel')
            } else if (dataObject.type === 'blueSpawn') {
                //@ts-ignore
                this.blueJewel = this.physics.add.sprite(dataObject.x, dataObject.y, 'blue-jewel')
            }else if (dataObject.type === 'greenSpawn') {
                //@ts-ignore
                this.greenJewel = this.physics.add.sprite(dataObject.x, dataObject.y, 'green-jewel')
            } else if (dataObject.type === 'yellowSpawn') {
                //@ts-ignore
                this.yellowJewel = this.physics.add.sprite(dataObject.x, dataObject.y, 'yellow-jewel')
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
        //-- Jewels --//
        this.physics.add.overlap(this.player.sprite, this.redJewel, this.collectRedJewel, null, this)
        this.physics.add.overlap(this.player.sprite, this.blueJewel, this.collectBlueJewel, null, this)
        this.physics.add.overlap(this.player.sprite, this.greenJewel, this.collectGreenJewel, null, this)
        this.physics.add.overlap(this.player.sprite, this.yellowJewel, this.collectYellowJewel, null, this)
        //-- Enemies --//
        this.events.on('enemymove', this.handleEnemyMove, this)
        this.time.delayedCall(1000, this.onEnemySpawn, [], this)
        this.time.delayedCall(5000, this.onEnemySpawn, [], this)
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
        let toX = Math.floor(point.x / this.map.tileWidth)
        let toY = Math.floor(point.y / this.map.tileHeight)
        let fromX = Math.floor(this.activeEnemy.sprite.x / this.map.tileWidth)
        let fromY = Math.floor(this.activeEnemy.sprite.y / this.map.tileHeight)
        let callback = this.moveEnemy.bind(this)
        this.finder.findPath(fromX, fromY, toX, toY, function (path) {
            if (path === null) {
                console.warn("Path was not found.")
            } else {
                console.log('found path')
                callback(path)
            }
        })
        this.finder.calculate()
    }

    moveEnemy(path) {
        if (this.player.isDead) {
            return
        }
        //-- Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline --//
        let tweenList = []
        for (let i = 0; i < path.length - 1; i++) {
            let cx = path[i].x
            let cy = path[i].y
            let dx = path[i + 1].x
            let dy = path[i + 1].y
            let a
            if (dx > cx) {
                a = 0
            } else if (dx < cx) {
                a = 180
            }
            if (dy > cy) {
                a = 90
            } else if (dy < cy) {
                a = 270
            }
            tweenList.push({
                targets: this.activeEnemy.sprite,
                x: { value: (dx * this.map.tileWidth) + (0.5 * this.map.tileWidth), duration: this.activeEnemy.speed },
                y: { value: (dy * this.map.tileHeight) + (0.5 * this.map.tileHeight), duration: this.activeEnemy.speed },
                angle: { value: a, duration: 0 }
            })
        }
        this.tweens.timeline({
            tweens: tweenList
        })
    }

    onEnemySpawn() {
        let index = Phaser.Math.Between(0, this.enemySpawnPoints.length - 1)
        let spawnPoint = this.enemySpawnPoints[index]
        let enemy = new Enemy(this, spawnPoint.x, spawnPoint.y, 'enemy')
        enemy.targetX = spawnPoint.x
        enemy.targetY = spawnPoint.y
        this.enemies.push(enemy)
        this.physics.add.overlap(this.player.sprite, enemy.sprite, this.collideEnemy, null, this)
    }

    handleEnemyMove(enemy) {
        let toX = (Math.floor(this.player.sprite.x / this.map.tileWidth) * this.map.tileWidth) + this.map.tileWidth / 2
        let toY = (Math.floor(this.player.sprite.y / this.map.tileHeight) * this.map.tileHeight) + this.map.tileHeight / 2
        let point = { x: toX, y: toY }
        enemy.targetX = point.x
        enemy.targetY = point.y
        this.activeEnemy = enemy
        this.findPath(point)
    }

    collectGun(player, gun) {
        this.gun.destroy()
        this.player.hasGun = true
        this.player.sprite.setTexture('man-with-gun')
    }

    collectRedJewel(player, redJewel) {
        this.redJewel.destroy()
        this.check1.setVisible(true)
        this.jewelsCollected += 1
    }

    collectBlueJewel(player, blueJewel) {
        this.blueJewel.destroy()
        this.check2.setVisible(true)
        this.jewelsCollected += 1
    }

    collectGreenJewel(player, greenJewel) {
        this.greenJewel.destroy()
        this.check3.setVisible(true)
        this.jewelsCollected += 1
    }

    collectYellowJewel(player, yellowJewel) {
        this.yellowJewel.destroy()
        this.check4.setVisible(true)
        this.jewelsCollected += 1
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
            this.physics.velocityFromRotation(bullet.rotation, 800, bullet.body.velocity)
            for (let i = 0; i < this.enemies.length; i++) {
                this.physics.add.collider(this.enemies[i].sprite, bullet, this.bulletHitEnemy, null, this)
            }
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
        bullet.disableBody(true, true)
        this.enemiesKilled += 1
        this.enemiesKilledText.setText('Enemies Killed = ' + this.enemiesKilled)
        let index
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].sprite === enemySprite) {
                index = i
                break
            }
        }
        this.enemies.splice(index, 1)
        this.add.image(enemySprite.x, enemySprite.y, 'dead-enemy').setRotation(enemySprite.rotation).setDepth(0)
        enemySprite.destroy()
        if (!this.player.isDead && this.enemies.length < this.minEnemies) {
            this.onEnemySpawn()
        }
    }

    collideEnemy(player, enemySprite) {
        this.tweens.killAll()
        this.physics.pause()
        this.player.isDead = true
        this.player.sprite.setTint(0xFF0000)
    }

    update(time, delta) {
        this.player.update(time, delta)
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(time, delta)
        }
        if(this.jewelsCollected === 4){
            this.scene.pause()
            this.scene.start('MenuScene')
        }
    }

    checkValid(x, y) {
        let tile = this.map.getTileAt(x, y)
        if (tile) {
            return tile.properties.valid == true
        } else {
            return false
        }
    }
}