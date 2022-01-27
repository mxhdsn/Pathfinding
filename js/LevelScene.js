class LevelScene extends Phaser.Scene{
    /**@type {Phaser.Tilemaps.Tilemap} */
    background

    constructor(id){
        super('LevelScene')
    }

    preload(){
        //-- Load Background --//
        this.load.tilemapTiledJSON('background2', 'assets/levels_json/background2.json')
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
    }

    create(){
        //-- Create Background --//
        this.background2 = this.make.tilemap({ key: 'background2' })
        this.cameras.main.setBounds(0, 0, this.background2.widthInPixels, this.background2.heightInPixels)
        this.physics.world.setBounds(0, 0, this.background2.widthInPixels, this.background2.heightInPixels)
        const tileset = this.background2.addTilesetImage('tileset', 'tileset')
        const background2 = this.background2.createLayer('background', 'tileset', 0, 0)
        //-- Button Borders --//
        this.border = new Phaser.Geom.Rectangle(0, 0, 1997, 1997)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.border)
        this.border2 = new Phaser.Geom.Rectangle(100, 100, 1800, 1800)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.border2)
        this.level1Border = new Phaser.Geom.Rectangle(200, 200, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level1Border)
        this.level2Border = new Phaser.Geom.Rectangle(800, 200, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level2Border)
        this.level3Border = new Phaser.Geom.Rectangle(1400, 200, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level3Border)
        this.level4Border = new Phaser.Geom.Rectangle(200, 800, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level4Border)
        this.level5Border = new Phaser.Geom.Rectangle(800, 800, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level5Border)
        this.level6Border = new Phaser.Geom.Rectangle(1400, 800, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level6Border)
        this.level7Border = new Phaser.Geom.Rectangle(200, 1400, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level7Border)
        this.level8Border = new Phaser.Geom.Rectangle(800, 1400, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level8Border)
        this.level9Border = new Phaser.Geom.Rectangle(1400, 1400, 400, 400)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.level9Border)
        //-- Level Select Text --//
        var level1 = this.add.text(360, 340, '1', {
            fontSize: '150px'
        })
        level1.setInteractive({useHandCursor: true})
        level1.on('pointerdown', () => this.scene.start('Level1'))
        var level2 = this.add.text(960, 340, '2', {
            fontSize: '150px'
        })
        level2.setInteractive({useHandCursor: true})
        level2.on('pointerdown', () => this.scene.start('Level2'))
        var level3 = this.add.text(1550, 340, '3', {
            fontSize: '150px'
        })
        level3.setInteractive({useHandCursor: true})
        level3.on('pointerdown', () => this.scene.start('Level3'))
        var level4 = this.add.text(350, 940, '4', {
            fontSize: '150px'
        })
        level4.setInteractive({useHandCursor: true})
        level4.on('pointerdown', () => this.scene.start('Level4'))
        // var level5 = this.add.text(950, 940, '5', {
        //     fontSize: '150px'
        // })
        // level5.setInteractive({useHandCursor: true})
        // var level6 = this.add.text(1550, 940, '6', {
        //     fontSize: '150px'
        // })
        // level6.setInteractive({useHandCursor: true})
        // var level7 = this.add.text(350, 1540, '7', {
        //     fontSize: '150px'
        // })
        // level7.setInteractive({useHandCursor: true})
        // var level8 = this.add.text(950, 1540, '8', {
        //     fontSize: '150px'
        // })
        // level8.setInteractive({useHandCursor: true})
        // var level9 = this.add.text(1550, 1540, '9', {
        //     fontSize: '150px'
        // })
        // level9.setInteractive({useHandCursor: true})
        //-- Back Button --//
        var backButton = this.add.text(100, 1900, 'BACK', {
            fontSize: '90px'
        })
        backButton.setInteractive({useHandCursor: true})
        backButton.on('pointerdown', () => this.scene.start('MenuScene'))
    }
}