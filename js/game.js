/// <reference path="./types/index.d.ts" />

const screenSize = {
    x: 1280,
    y: 720,
}

const playerAttributes = {
    speed: 256.0,
}

class GameScene extends Phaser.Scene {

    preload() {
        this.load.image("grass", "assets/img/grass.png");
    }

    create() {
        this.playerData = {
            health: 100.0,
            maxHealth: 100.0,
            currentSpeed: playerAttributes.speed,
            
            inventory: [],
            
            damageCooldown: 100, // Cooldown for taking damage
            lastDamage: 0,
        }

        // Background
        // Infinite map was a bad idea, just make it big enough
        this.background = this.add.tileSprite(0, 0, screenSize.x * 5, screenSize.x * 5, "grass");
        this.cameras.main .setBounds(-screenSize.x * 2.5, -screenSize.y * 2.5, screenSize.x * 5, screenSize.y * 5);
        this.physics.world.setBounds(-screenSize.x * 2.5, -screenSize.y * 2.5, screenSize.x * 5, screenSize.y * 5);

        // TODO: Replace with spritesheet
        this.player = this.add.text(0, 0, "Player", { fontSize: "32px", fill: "#fff", fontFamily: "Noto Sans" }).setOrigin(0.5);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // WASD Movement
        this.keyIn = {
            up      : this.input.keyboard.addKey("W"),
            upAlt   : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),

            down    : this.input.keyboard.addKey("S"),
            downAlt : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            
            left    : this.input.keyboard.addKey("A"),
            leftAlt : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            
            right   : this.input.keyboard.addKey("D"),
            rightAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),

            restart : this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
        };

        // Camera setup
        this.cameras.main.startFollow(this.player, false);

        // Example setup for enemies
        this.enemyObjects = this.add.group();
        this.enemies = [ 
            new Enemy(this, -200, -200),
            new Enemy(this,  200,  200),
            new FastEnemy(this, 200, -200),
        ];
        this.physics.add.collider(this.player, this.enemyObjects, (player, enemy) => {
            this.damagePlayer(10);
        });
        this.physics.add.collider(this.enemyObjects, this.enemyObjects);

        // Example setup for weapon attacks
        this.weaponAttacks = this.add.group();
        this.physics.add.collider(this.weaponAttacks, this.enemyObjects, (weapon, enemy) => {
            enemy.wrapper.damage(weapon.wrapper.properties.attackDamage);
        });

        this.playerData.inventory.push(new Sword(this, "Sword"));
    }

    init() {

    }

    update() {
        this.updatePlayerMovement();

        for (let enemy of this.enemies) {     
            enemy.update();
        }

        for (let weapon of this.playerData.inventory) {
            weapon.update();
        }

        // Restart scene (for debugging)
        if (this.keyIn.restart.isDown) {
            this.scene.restart();
        }
    }

    updatePlayerMovement() {
        let playerMovement = new Phaser.Math.Vector2(0, 0);
        if (this.keyIn.up.isDown    || this.keyIn.upAlt.isDown   ) {
            playerMovement.y -= 1;
        }
        if (this.keyIn.down.isDown  || this.keyIn.downAlt.isDown ) {
            playerMovement.y += 1;
        }
        if (this.keyIn.left.isDown  || this.keyIn.leftAlt.isDown ) {
            playerMovement.x -= 1;
        }
        if (this.keyIn.right.isDown || this.keyIn.rightAlt.isDown) {
            playerMovement.x += 1;
        }
        playerMovement.normalize();
        playerMovement.scale(playerAttributes.speed);
        
        this.player.body.setVelocity(playerMovement.x, playerMovement.y);
    }

    damagePlayer(amount) {
        if (this.playerData.lastDamage + this.playerData.damageCooldown > this.time.now) {
            return;
        }

        this.playerData.health -= amount;
        if (this.playerData.health <= 0) {
            this.scene.restart();
        }

        this.playerData.lastDamage = this.time.now;

        console.log("AUGH! " + this.playerData.health);
    }

}

const gameScene = new GameScene("Game");
const game = new Phaser.Game({
    width : screenSize.x,
    height: screenSize.y,
    scene: [
        gameScene,
    ],
    physics: {
        default: "arcade",
        arcade : {
            gravity: { y: 0 },
            debug  : true,
        },
    },
});