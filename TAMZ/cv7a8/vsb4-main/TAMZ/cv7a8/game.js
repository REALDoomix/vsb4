const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.ENVELOP,
        //mode: Phaser.Scale.FIT,
        //autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        // other scale options...
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    debug: true
};

const game = new Phaser.Game(config);
let player;
let items;
let map;
let backgroundLayer;
let collisionLayer;
let cursors;
let text;
let score = 0;

function preload() {

    this.load.spritesheet('robot', 'assets/lego.png',
        { frameWidth: 37, frameHeight: 48 });

    this.load.spritesheet('items', 'assets/items.png',
        { frameWidth: 32, frameHeight: 32 });

    this.load.image('tiles', 'assets/map_tiles.png');
    this.load.tilemapTiledJSON('json_map', 'assets/json_map.json');


}

function create() {
    map = this.make.tilemap({ key: 'json_map' });
    //'map_tiles' - name of the tilesets in json_map.json
    //'tiles' - name of the image in load.images()
    const tiles = map.addTilesetImage('map_tiles', 'tiles');

    backgroundLayer = map.createLayer('background', tiles, 0, 0);
    collisionLayer = map.createLayer('collision', tiles, 0, 0);
    
    // https://docs.phaser.io/api-documentation/class/tilemaps-tilemap#setcollisionbyexclusion
    collisionLayer.setCollisionByExclusion([ -1 ]);
    
    
    player = this.physics.add.sprite(100, 100, 'robot'); 
    items = this.physics.add.sprite(200, 100, 'items', 20);
    
    text = this.add.text(0, 0, `Current score: ${score}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
 
    
    cursors = this.input.keyboard.createCursorKeys();
    
    //Přidat hráčí kolize
    this.physics.add.collider(player, collisionLayer);

    //overlap - když se překrývají tak se zavolá funkce v posledním parametru (collisionHandler)
    this.physics.add.overlap(player, backgroundLayer);    
    this.physics.add.overlap(player, items, collisionHandler);

    // https://docs.phaser.io/api-documentation/class/cameras-scene2d-camera#startfollow	

    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 15 }),
        frameRate: 20,
        repeat: -1
    });    
}

function update() {

    //player.anims.play('run', true);

    // Horizontal movement
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-150);
        player.angle = 90;
        player.anims.play('run', true); 
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(150);
        player.angle = 270;
        player.anims.play('run', true); 
    }
    else if (cursors.down.isDown)
    {
        player.body.setVelocityY(150);
        player.angle = 0;
        player.anims.play('run', true); 
    }
    else if (cursors.up.isDown)
    {
        player.body.setVelocityY(-150);
        player.angle = 180;
        player.anims.play('run', true); 
    }
    else
    {
        player.body.setVelocityX(0);
        player.body.setVelocityY(0);
        player.anims.play('run', false); 
    } 
    updateText();
}

function updateText() {
    text.setText(`Current score: ${score}`);
}

function collisionHandler(player, item) {
    //console.log("collision")
    item.disableBody(true, true);
    if (item.body.enable == false)
    {
      // https://docs.phaser.io/api-documentation/class/physics-arcade-sprite#enablebody
      let itemX = Phaser.Math.Between(100, 400);
      let itemY = Phaser.Math.Between(100, 400);
      score += 1
      updateText();
      item.enableBody(true, itemX, itemY, true, true);
    }

}

