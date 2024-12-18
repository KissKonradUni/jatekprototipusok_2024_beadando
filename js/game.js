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
        this.load.image("Sword_1", "assets/weapons/sword_1.png");
        //running sheets
        this.load.spritesheet("rLeft", "assets/hero/run_left.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("rRight", "assets/hero/run_right.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("rUp", "assets/hero/run_up.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("rDown", "assets/hero/run_down.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });

        //idle sheets
        this.load.spritesheet("iDown", "assets/hero/idle_down.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("iUp", "assets/hero/idle_up.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("iLeft", "assets/hero/idle_left.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("iRight", "assets/hero/idle_right.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });

        //death
        this.load.spritesheet("dLeft", "assets/hero/death_left.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("dRight", "assets/hero/death_right.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("dUp", "assets/hero/death_up.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("dDown", "assets/hero/death_down.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });

        //taking damage
        this.load.spritesheet("hLeft", "assets/hero/hurt_left.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("hRight", "assets/hero/hurt_right.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("hUp", "assets/hero/hurt_up.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("hDown", "assets/hero/hurt_down.png", {
            frameWidth: 64,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });

    }

    create() {
        if (!this.anims.exists("rDown"))
            this.createAnimetions();

        this.playerData = {
            health: 100.0,
            maxHealth: 100.0,
            currentSpeed: playerAttributes.speed,

            inventory: [],

            damageCooldown: 700, // Cooldown for taking damage
            lastDamage: 0,
        }

        // Background
        // Infinite map was a bad idea, just make it big enough
        this.background = this.add.tileSprite(0, 0, screenSize.x * 5, screenSize.x * 5, "grass");
        this.cameras.main.setBounds(-screenSize.x * 2.5, -screenSize.y * 2.5, screenSize.x * 5, screenSize.y * 5);
        this.physics.world.setBounds(-screenSize.x * 2.5, -screenSize.y * 2.5, screenSize.x * 5, screenSize.y * 5);

        // TODO: Replace with spritesheet
        this.player = this.add.sprite(0, 0, "rDown", 1);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // WASD Movement
        this.keyIn = {
            up: this.input.keyboard.addKey("W"),
            upAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),

            down: this.input.keyboard.addKey("S"),
            downAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),

            left: this.input.keyboard.addKey("A"),
            leftAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),

            right: this.input.keyboard.addKey("D"),
            rightAlt: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),

            restart: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
        };

        // Camera setup
        this.cameras.main.startFollow(this.player, false);

        // Example setup for enemies
        this.enemyObjects = this.add.group();
        this.enemies = [
            // new Enemy(this, -200, -200),
            // new Enemy(this, 200, 200),
            // new FastEnemy(this, 200, -200),
        ];

        this.physics.add.collider(this.player, this.enemyObjects, (player, enemy) => {
            this.damagePlayer(10);
        });
        this.physics.add.collider(this.enemyObjects, this.enemyObjects);

        // Example setup for weapon attacks
        this.weaponAttacks = this.add.group();

        this.playerData.inventory.push(new Sword(this, "Sword"));
        this.setEnemySpawn();
    }

    init() {
        this.lastMovment = "d";
        this.moveEnabled = true;
        
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
        let moving = false;
        let goingSide = false;
        if (this.moveEnabled) {
            if (this.keyIn.left.isDown || this.keyIn.leftAlt.isDown) {
                this.player.anims.play("rLeft", true);
                playerMovement.x -= 1;
                this.lastMovment = "l";
                goingSide = true;
                moving = true;
            }
            if (this.keyIn.right.isDown || this.keyIn.rightAlt.isDown) {
                this.player.anims.play("rRight", true);
                playerMovement.x += 1;
                this.lastMovment = "r";
                goingSide = true;
                moving = true;
            }
            if (this.keyIn.up.isDown || this.keyIn.upAlt.isDown) {
                if (!goingSide) {
                    this.player.anims.play("rUp", true);
                    this.lastMovment = "u";
                }

                playerMovement.y -= 1;
                moving = true;
            }
            if (this.keyIn.down.isDown || this.keyIn.downAlt.isDown) {
                if (!goingSide) {
                    this.player.anims.play("rDown", true);
                    this.lastMovment = "d";
                }
                playerMovement.y += 1;
                moving = true;
            }
        }

        if (!moving && this.moveEnabled) {
            switch (this.lastMovment) {
                case "u":
                    this.player.anims.play("iUp", true);
                    break;
                case "d":
                    this.player.anims.play("iDown", true);
                    break;
                case "l":
                    this.player.anims.play("iLeft", true);
                    break;
                case "r":
                    this.player.anims.play("iRight", true);
                    break;
            }
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
            switch (this.lastMovment) {
                case "u":
                    this.player.anims.play("dUp", true);
                    break;
                case "d":
                    this.player.anims.play("dDown", true);
                    break;
                case "l":
                    this.player.anims.play("dLeft", true);
                    break;
                case "r":
                    this.player.anims.play("dRight", true);
                    break;
            }
            this.player.on('animationcomplete', () => {
                this.scene.restart();
            });
        } else {
            switch (this.lastMovment) {
                case "u":
                    this.player.anims.play("hUp", true);
                    break;
                case "d":
                    this.player.anims.play("hDown", true);
                    break;
                case "l":
                    this.player.anims.play("hLeft", true);
                    break;
                case "r":
                    this.player.anims.play("hRight", true);
                    break;
            }
            this.time.delayedCall(50, () => {
                this.moveEnabled = true;
            });
        }
        this.moveEnabled = false;
        this.playerData.lastDamage = this.time.now;
        console.log("AUGH! " + this.playerData.health);
    }

    createAnimetions() {
        //run
        this.anims.create({
            key: 'rUp',
            frames: this.anims.generateFrameNames("rUp", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: 0
        });
        this.anims.create({
            key: 'rDown',
            frames: this.anims.generateFrameNames("rDown", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: 0
        });
        this.anims.create({
            key: 'rLeft',
            frames: this.anims.generateFrameNames("rLeft", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: 0
        });
        this.anims.create({
            key: 'rRight',
            frames: this.anims.generateFrameNames("rRight", {
                frames: [0, 1, 2, 3, 4, 5, 6, 7]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: 0
        });

        //idle
        this.anims.create({
            key: 'iRight',
            frames: this.anims.generateFrameNames("iRight", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'iLeft',
            frames: this.anims.generateFrameNames("iLeft", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'iUp',
            frames: this.anims.generateFrameNames("iUp", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });
        this.anims.create({
            key: 'iDown',
            frames: this.anims.generateFrameNames("iDown", {
                frames: [0, 1, 2, 3]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });

        //death
        this.anims.create({
            key: 'dRight',
            frames: this.anims.generateFrameNames("dRight", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 12,
            yoyo: false,
            repeat: 0
        });
        this.anims.create({
            key: 'dLeft',
            frames: this.anims.generateFrameNames("dLeft", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 12,
            yoyo: false,
            repeat: 0
        });
        this.anims.create({
            key: 'dUp',
            frames: this.anims.generateFrameNames("dUp", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 12,
            yoyo: false,
            repeat: 0
        });
        this.anims.create({
            key: 'dDown',
            frames: this.anims.generateFrameNames("dDown", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 12,
            yoyo: false,
            repeat: 0
        });

        //taking damage
        this.anims.create({
            key: 'hRight',
            frames: this.anims.generateFrameNames("hRight", {
                frames: [0, 1, 2, 3, 4]
            }),
            duration: 100,
            yoyo: false,
            repeat: 0
        });
        this.anims.create({
            key: 'hLeft',
            frames: this.anims.generateFrameNames("hLeft", {
                frames: [0, 1, 2, 3, 4]
            }),
            duration: 100,
            yoyo: false,
            repeat: 0
        });
        this.anims.create({
            key: 'hUp',
            frames: this.anims.generateFrameNames("hUp", {
                frames: [0, 1, 2, 3, 4]
            }),
            duration: 100,
            yoyo: false,
            repeat: 0
        });
        this.anims.create({
            key: 'hDown',
            frames: this.anims.generateFrameNames("hDown", {
                frames: [0, 1, 2, 3, 4]
            }),
            duration: 100,
            yoyo: false,
            repeat: 0
        });
    }

    setEnemySpawn(){
        this.time.addEvent({
            delay:2000,
            repeat: -1,
            callback: ()=>{
                console.log("Add new enemy");
                this.enemies.push(new Enemy(this,150,150));
                this.physics.add.collider(this.weaponAttacks, this.enemyObjects, (weapon, enemy) => {
                    enemy.wrapper.damage(weapon.wrapper.properties.attackDamage);
                });
            }
        });
    }
}

const gameScene = new GameScene("Game");
const game = new Phaser.Game({
    width: screenSize.x,
    height: screenSize.y,
    scene: [
        gameScene,
    ],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true,
        },
    },
});