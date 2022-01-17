class Enemy{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    sprite
    /** @type {number} */
    speed = 200 // milliseconds between tiles
    /** @type {number} */
    targetX
    /** @type {number} */
    targetY
    /** @type {boolean} */
    pendingMove

    constructor(scene, x, y, texture) {
        this.scene = scene
        this.sprite = scene.physics.add.sprite(x, y, texture)
        this.sprite.body.immovable = true
    }

    update(time, delta){
    }
    
    beginMove(){
    }
}