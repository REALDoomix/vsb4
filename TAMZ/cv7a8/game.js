const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        //mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'game-container',
        // other scale options...
        width: 800,
        height: 600,
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
let player, items, map, backgroundLayer, collisionLayer, cursors, text, pauseText, pauseOverlay;
let lives = 3;
let score = 0, highscore = 0, topScore = loadHighscore(), lastEnemyCollisionTime = 0, pointsPicked = 0;

function preload() {

    this.load.spritesheet('robot', 'assets/Soldier-Walk.png',
        { frameWidth: 100, frameHeight: 100 });

    this.load.spritesheet('enemy', 'assets/Orc-Walk.png',
        { frameWidth: 100, frameHeight: 100});


    this.load.spritesheet('items', 'assets/items.png',
        { frameWidth: 32, frameHeight: 32 });

    this.load.image('tiles', 'assets/map_tiles.png');
    this.load.tilemapTiledJSON('json_map', 'assets/json_map.json');


    this.canvas = this.sys.game.canvas;

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


    let mapCenterX = map.widthInPixels / 2;
    let mapCenterY = map.heightInPixels / 2;

    
    
    //Enemy
    enemy = this.physics.add.sprite(400,300, 'enemy');
    enemy.body.setSize(14,24);
    enemy.body.setOffset(44,50);
    

    //Player
    player = this.physics.add.sprite(100, 100, 'robot'); 
    player.body.setSize(14,20);
    player.body.setOffset(40, 38);


    

    //items
    items = this.physics.add.sprite(200, 100, 'items', 20);

    healthBonus = this.physics.add.sprite(Phaser.Math.Between(50, 650), Phaser.Math.Between(50, 350), 'items', 53);
    
    text = this.add.text(0, 400, `All-time Top Score: ${topScore}\n\nSession Highscore: ${highscore}\n\nCurrent score: ${score}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });



    pauseText = this.add.text(mapCenterX, mapCenterY, `       Game Paused\nPress ESC to unpause`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }).setOrigin(0.5);
    pauseText.setVisible(false);
    pauseText.setDepth(1001);

    healthBar = this.add.text(200, 400, `Lives: ${lives}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });

    //pause overlay

    pauseOverlay = this.add.rectangle(400,300,800,600, 0x000000, 0.5);
    pauseOverlay.setVisible(false);
    pauseOverlay.setDepth(1000);


    cursors = this.input.keyboard.createCursorKeys();

    document.addEventListener('keydown', (k) => {
     if(k.key == 'Escape'){   
        if(this.scene.isPaused()){
            resumeGame(this);
        } else {
            pauseGame(this);
        }
    } else if(k.key == 'r'){
        restartGame(this);
    }
    });

    //Přidat hráčí kolize
    this.physics.add.collider(player, collisionLayer);
    
    //Enemy collisions
    this.physics.add.collider(enemy,collisionLayer);

    //overlap - když se překrývají tak se zavolá funkce v posledním parametru (collisionHandler)
    this.physics.add.overlap(player, backgroundLayer);    
    this.physics.add.overlap(player, items, collisionHandler);
    this.physics.add.overlap(player, healthBonus, healthBonusHandler);

    //Overlap enemy a player

    this.physics.add.overlap(player,enemy, enemyCollision);

    // https://docs.phaser.io/api-documentation/class/cameras-scene2d-camera#startfollow	


    //Player running animation
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('robot', { start: 0, end: 7}),
        frameRate: 20,
        repeat: -1
    });    

    //Enemy running animation
    this.anims.create({
        key: 'enemyRun',
        frames: this.anims.generateFrameNumbers('enemy', {start:0, end:7}),
        frameRate: 20,
        repeat: -1
    })
}

function update() {
    //player.anims.play('run', true);´
    
    if(player.x == enemy.x && player.y == enemy.y){
        enemy.anims.play('enemyRun', false);
    } else {
        this.physics.moveToObject(enemy,player,70);
        enemy.anims.play('enemyRun', true);
    }


    let touchDown = false, touchLeft = false, touchRight = false, touchUp = false;

    if (this.input.activePointer.isDown) {
        // touch control
        touchLeft = this.input.activePointer.x < 150 ? true : false;
        touchRight = this.input.activePointer.x > 400 ? true : false;
        touchUp = this.input.activePointer.y < 150 ? true : false;
        touchDown = this.input.activePointer.y > 300 ? true : false;

    }


    // keyboard movement
    if (cursors.left.isDown || touchLeft)
    {
        PlayerMove(-150,0);
        player.flipX = true;
    }
    else if (cursors.right.isDown || touchRight)
    {
        PlayerMove(150,0);
        player.flipX = false;
    }
    if (cursors.down.isDown || touchDown)
    {
        PlayerMove(0,150);
    }
    else if (cursors.up.isDown || touchUp)
    {
        PlayerMove(0,-150);
    }
    if (!cursors.left.isDown && !cursors.right.isDown && !cursors.down.isDown && !cursors.up.isDown && !this.input.activePointer.isDown) {
        player.body.setVelocityX(0);
        player.body.setVelocityY(0);
        player.anims.play('run', false);
    }
    updateText();

    if(lives < 1){
        endGame(this);
    }
}

// funkce pro pohyb hráče
function PlayerMove(x,y){
    player.body.setVelocityX(x);
    player.body.setVelocityY(y);
    player.anims.play('run',true);
}
// funkce pro spawnování health bunusu
function healthPoints(){
    if(pointsPicked == 10){
        pointsPicked = 0;
        let itemx, itemy;
        let validSpawn = false;

        while(!validSpawn){
            itemx = Phaser.Math.Between(50, 650);
            itemy = Phaser.Math.Between(50, 350);
            if(isValidSpawnLocation(itemx, itemy)){
                validSpawn = true;
            }
        }

        healthBonus.enableBody(true, itemx, itemy, true, true);
    }
}


function updateText() {
    text.setText(`All-time Top Score: ${topScore}\n\nSession Highscore: ${highscore}\n\nCurrent score: ${score}`);
    healthBar.setText(`Lives: ${lives}`);
}

// 2funkce pro pauzu hry
function pauseGame(scene){
    scene.scene.pause();
    pauseOverlay.setVisible(true);
    text.setVisible(false);
    pauseText.setVisible(true);
    
}

function resumeGame(scene){
    scene.scene.resume();
    pauseOverlay.setVisible(false);
    text.setVisible(true);
    pauseText.setVisible(false);
}

function endGame(scene){
    if(highscore > topScore) {
        topScore = highscore;
        saveHighscore(topScore);
    }
    pauseGame(scene);
    pauseText.setText(`You died, session score: ${highscore}\nAll-time top: ${topScore}\nTo restart press r`);
}

function restartGame(scene){
    score = 0, highscore = 0, lastEnemyCollisionTime = 0, pointsPicked = 0, lives = 3;
    // topScore persists, do not reset it
    scene.scene.restart();
}


//Enemy collision handling
function enemyCollision(){
    
    const now = Date.now();
    if (now - lastEnemyCollisionTime > 1000){
        score -= score > 0 ? 1 : 0;
        lives -= 1;
        lastEnemyCollisionTime = now;
        updateText();
    }
}

//Pomocná funkce pro checkování validity náhodného spawnu

function isValidSpawnLocation(x, y) {
    const tile = collisionLayer.getTileAtWorldXY(x, y);
    return !tile;  // Valid if no tile present
}

function collisionHandler(player, item) {
    //console.log("collision")
    item.disableBody(true, true);
    if (item.body.enable == false)
    {
        let itemX, itemY;
        let validSpawn = false;
        let attempts = 0;

      while (!validSpawn) {
            itemX = Phaser.Math.Between(50, 650);
            itemY = Phaser.Math.Between(50, 350);
            
            if (isValidSpawnLocation(itemX, itemY)) {
                validSpawn = true;
            }
            attempts++;
        }

        if (validSpawn) {
            score += 1;
            pointsPicked += 1;
            if(score > highscore){ highscore = score}
            if(score > topScore){ topScore = score}
            updateText();
            healthPoints();
            item.enableBody(true, itemX, itemY, true, true);
        }
    }

}

function healthBonusHandler(player ,healthBonus) {
    healthBonus.disableBody(true, true);
    lives += 1;
    updateText();
}


