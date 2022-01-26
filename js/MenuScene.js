class MenuScene extends Phaser.Scene{
    /** @type {Phaser.Tilemaps.Tilemap} */
    background

    constructor(id){
        super('MenuScene')
    }

    preload(){
        //-- Background Loading --//
        this.load.tilemapTiledJSON('background', 'assets/background.json')
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
    }

    create(){
        //- -Creating the Background --/
        this.background = this.make.tilemap({ key: 'background' })
        this.cameras.main.setBounds(0, 0, this.background.widthInPixels, this.background.heightInPixels)
        this.physics.world.setBounds(0, 0, this.background.widthInPixels, this.background.heightInPixels)
        const tileset = this.background.addTilesetImage('tileset', 'tileset')
        const background = this.background.createLayer('background', 'tileset', 0, 0)
        //-- Button Borders --//
        this.border = new Phaser.Geom.Rectangle(0, 0, 1997, 1997)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.border)
        this.titleBorder = new Phaser.Geom.Rectangle(200, 200, 1600, 500)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.titleBorder)
        this.playButtonBorder = new Phaser.Geom.Rectangle(500, 900, 1000, 200)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.playButtonBorder)
        this.levelButtonBorder = new Phaser.Geom.Rectangle(500, 1200, 1000, 200)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.levelButtonBorder)
        this.exitButtonBorder = new Phaser.Geom.Rectangle(700, 1600, 600, 200)
        this.add.graphics().lineStyle(5, 0xFFFFFF).strokeRectShape(this.exitButtonBorder)
        //-- Title --//
        var title = this.add.text(280, 300, 'JEWELLED', {
            fontSize: '300px'
        })
        //-- Buttons --//
        var playButton = this.add.text(820, 940, 'PLAY', {
            fontSize: '150px',
        })
        var levelButton = this.add.text(730, 1235, 'LEVELS', {
            fontSize: '150px'
        })
        var exitButton = this.add.text(815, 1640, 'EXIT', {
            fontSize: '150px'
        })
        playButton.setInteractive({useHandCursor: true})
        playButton.on('pointerdown', () => this.scene.start('pathFindingScene'))
        levelButton.setInteractive({useHandCursor: true})
        levelButton.on('pointerdown', () => this.scene.start('LevelScene'))
        exitButton.setInteractive({useHandCursor: true})
    }
}