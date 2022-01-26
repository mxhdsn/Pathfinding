class LevelScene extends Phaser.Scene{
    /**@type {Phaser.Tilemaps.Tilemap} */
    background

    constructor(id){
        super('LevelScene')
    }

    preload(){
        //-- Load Background --//
        this.load.tilemapTiledJSON('background', 'assets/background2.json')
        this.load.image('tileset', 'assets/tiles100-spacing2.png')
    }

    create(){
        //-- Create Background --//
        this.background = this.make.tilemap({ key: 'background' })
        this.cameras.main.setBounds(0, 0, this.background.widthInPixels, this.background.heightInPixels)
        this.physics.world.setBounds(0, 0, this.background.widthInPixels, this.background.heightInPixels)
        const tileset = this.background.addTilesetImage('tileset', 'tileset')
        const background = this.background.createLayer('background', 'tileset', 0, 0)
    }
}