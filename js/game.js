/// <reference path="./types/index.d.ts" />

const screenSize = {
	x: 1280,
	y: 720,
};

const playerAttributes = {
	speed: 256.0,
};

class GameScene extends Phaser.Scene {

    preload() {
        this.load.image("grass", "assets/img/grass.png");
        //weapons
        this.load.image("Sword_1", "assets/weapons/sword_1.png");
        this.load.image("Sword_2", "assets/weapons/sword_2.png");
        this.load.image("Sword_3", "assets/weapons/sword_3.png");
        this.load.image("Sword_4", "assets/weapons/sword_4.png");
        this.load.image("Sword_5", "assets/weapons/sword_5.png");

        this.load.image("Shuriken", "assets/weapons/Shuriken.png");


        this.load.image("expOrb", "assets/img/expOrb.png");

        this.load.json('levelData', 'assets/gameData.json');
        this.load.json('weapons', 'assets/weaponData.json');

        //enemy sprites
        this.load.spritesheet("slime", "assets/enemies/slime.png", {
            frameWidth: 32,
            frameHeight: 32,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("skeleton", "assets/enemies/skeleton.png", {
            frameWidth: 48,
            frameHeight: 56,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("zombie", "assets/enemies/zombie.png", {
            frameWidth: 48,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });
        this.load.spritesheet("hound", "assets/enemies/hound.png", {
            frameWidth: 107,
            frameHeight: 64,
            margin: 0,
            spacing: 0
        });

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

        this.load.image("HealthBarBg", "assets/img/healthBarBg.png");
        this.load.image("HealthBarFill", "assets/img/healthBarFill.png");
        this.load.image("ExpBarBg", "assets/img/XPBarBg.png");
        this.load.image("ExpBarFill", "assets/img/XPBarFill.png");
    }

    create() {

        this.weaponData = this.cache.json.get('weapons');
        this.levelData = this.cache.json.get('levelData');

        this.playerData = {
            health: 100.0,
            maxHealth: 100.0,
            currentSpeed: playerAttributes.speed,

            level: 0,
            experience: 0,

            inventory: [],

            damageCooldown: 700, // Cooldown for taking damage
            lastDamage: 0,
        }
        this.playerData.maxHealth = this.levelData.levels[this.playerData.level].maxHealth;

        //level up weapons in inventory
        this.input.keyboard.on('keydown-T', (event) => {
            if (event.keyCode === Phaser.Input.Keyboard.KeyCodes.T) {
                // Check if the player has enough experience to level up
				let canLevelUp = this.playerData.experience >= this.levelData.levels[this.playerData.level].expNeeded;
				
				// Check if every weapon is maxed out (sum = 15)
				let allMaxed = this.playerData.inventory.map(weapon => weapon.level).reduce((a, b) => a + b, 0) == 15;
			
				if (canLevelUp && !allMaxed)
					this.scene.switch("LevelUp");
            }
        }, this);

        if (!this.anims.exists("rDown"))
            this.createAnimetions();

		// Background
		// Infinite map was a bad idea, just make it big enough
		this.background = this.add.tileSprite(0, 0, screenSize.x * 5, screenSize.x * 5, "grass");
		this.cameras.main.setBounds(-screenSize.x * 2.5, -screenSize.y * 2.5, screenSize.x * 5, screenSize.y * 5);
		this.physics.world.setBounds(-screenSize.x * 2.5, -screenSize.y * 2.5, screenSize.x * 5, screenSize.y * 5);

		//create player
		this.player = this.add.sprite(0, 0, "rDown", 1).setScale(2).setOrigin(0.5);
		this.physics.add.existing(this.player);
        this.player.body.setCircle(this.player.width / 4.0, 16, 16);
		this.player.body.setCollideWorldBounds(true);

		//Data panels
		//this.healthBar = this.add.rectangle(115, 70, 202, 22, 0x000000).setOrigin(0, 0).setScrollFactor(0, 0);
		//this.healthBarFill = this.add.rectangle(116, 71, 200, 20, 0xff0000).setOrigin(0, 0).setScrollFactor(0, 0);
        this.healthBar = this.add.sprite(115, 70, "HealthBarBg").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(1);
        this.healthBarFill = this.add.sprite(115, 70, "HealthBarFill").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(1);
		this.healtText = this.add
			.text(121, 74, "100/100", { fontSize: "16px", strokeThickness: 1, stroke: "#000", color: "#fff" })
			.setScrollFactor(0, 0)
            .setDepth(1);

		this.levelText = this.add
			.text(115, 95, "Stage:", { fontSize: "20px", strokeThickness: 0, stroke: "", color: "#000" })
			.setScrollFactor(0, 0);
		
		//this.expBar = this.add.rectangle(439, 70, 402, 12, 0x000000).setOrigin(0, 0).setScrollFactor(0, 0);
		//this.expBarFill = this.add.rectangle(440, 71, 400, 10, 0x0088ff).setOrigin(0, 0).setScrollFactor(0, 0);
        this.expBar = this.add.sprite(439, 70, "ExpBarBg").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(1);
        this.expBarFill = this.add.sprite(439, 70, "ExpBarFill").setOrigin(0, 0).setScrollFactor(0, 0).setDepth(1);
		this.expText = this.add
			.text(440, 85, "XP: ", { fontSize: "20px", strokeThickness: 0, stroke: "", color: "#000" })
			.setScrollFactor(0, 0);

		this.levelUpText = this.add
			.text(640, 120, "Press 'T' to level up", { fontSize: "20px", strokeThickness: 2, stroke: "#000", color: "#fff", align: "center" })
			.setOrigin(0.5, 0)
			.setScrollFactor(0, 0);

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
		this.camera = this.cameras.main.startFollow(this.player, false).setZoom(1.2);

        // Setup exp system
        this.expOrbs = this.add.group();
        this.exps = [];
        this.physics.add.collider(this.player, this.expOrbs, (player, orb) => {
            this.playerData.experience += orb.getData("quantity");
            console.log(this.playerData.experience);
            orb.destroy();
        });

        // Example setup for weapon attacks
        this.weaponAttacks = this.add.group();
        this.playerData.inventory.push(new Knife(this));

        //Enemy setup
        this.enemyObjects = this.add.group();
        this.enemies = [];
        this.setEnemySpawn();

        this.physics.add.collider(this.player, this.enemyObjects, (player, enemy) => {
            this.damagePlayer(enemy.wrapper.properties.damage);
        });
        this.physics.add.collider(this.enemyObjects, this.enemyObjects);
        this.physics.add.collider(this.weaponAttacks, this.enemyObjects, (weapon, enemy) => {
            enemy.wrapper.damage(weapon.wrapper.properties.attackDamage);
            if (weapon.wrapper.name == "Knife")
                if (weapon.wrapper.throwable == 0)
                {
                    weapon.wrapper.isDisabled = true;
                }
                else
                    weapon.wrapper.attack();
        });

        //Self recovery, amount and interval depend on level
        this.setSelfRecovery();
    }

    init() {
        this.equpmentLevels = { sword: 0, blade: 0, knife: 1 };
        this.lastMovment = "d";
        this.moveEnabled = true;
        this.registry.set("equipment", this.equpmentLevels);
        this.registry.set("ToUpgrade", null);
    }

    update() {
        this.updatePlayerMovement();

        //closest enemy to player
        this.closest = this.physics.closest(this.player, this.enemies.map(a => a.enemyObject));

        //update attribute panel
        this.healtText.setText(this.playerData.health.toFixed(0) + "/" + this.playerData.maxHealth.toFixed(0));
		//this.healthBarFill.width = Math.min(Math.max(200 * (this.playerData.health / this.playerData.maxHealth), 0), 200);
        this.healthBarFill.setCrop(0, 0, 202 * (this.playerData.health / this.playerData.maxHealth), 22);

        this.levelText.setText("Stage: " + this.playerData.level);
        
		this.expText.setText("XP: " + this.playerData.experience + "/" + this.levelData.levels[this.playerData.level].expNeeded);
		//this.expBarFill.width = Math.min(Math.max(400 * (this.playerData.experience / this.levelData.levels[this.playerData.level].expNeeded), 0), 400);
        this.expBarFill.setCrop(0, 0, 402 * (this.playerData.experience / this.levelData.levels[this.playerData.level].expNeeded), 12);
        

		this.levelUpText.setVisible(this.playerData.experience >= this.levelData.levels[this.playerData.level].expNeeded);

        for (let enemy of this.enemies) {
            enemy.update();
        }

		for (let weapon of this.playerData.inventory) {
			weapon.update();
		}

        // Restart scene (for debugging)
        if (this.keyIn.restart.isDown) {
            //this.scene.restart();
        }

        if (this.registry.get("ToUpgrade") != null)
            this.levelUp();
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
                this.registry.set("ToUpgrade", null);
				this.scene.switch("MainMenu");
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

	//TODO: boss spawn
	setEnemySpawn() {
		this.time.addEvent({
			delay: this.levelData.levels[this.playerData.level].waveInterval,
			repeat: -1,
			callback: () => {
				console.log("New wave!");
				this.levelData.levels[this.playerData.level].enemies.forEach((element) => {
					this.spawnWaveOf(element.quantity - 1, element.key);
				});
				//
			},
		});
	}

	spawnWaveOf(numberOfSpawn, monsterType) {
		this.waveTimer = this.time.addEvent({
			delay: 50,
			repeat: numberOfSpawn,
			callback: () => {
				if (this.enemies.length >= 20) {
					console.log("Too many enemies!");
					return;
				}

				console.log("Add enemy:" + monsterType);
                var angle = Math.random() * Math.PI * 2;
                var distance = Math.random() * screenSize.y / 2 + screenSize.y / 4;
                var x = Math.cos(angle) * distance + this.player.x;
                var y = Math.sin(angle) * distance + this.player.y;
				this.createEnemy(x, y, monsterType);
			},
		});
	}

	//create specific enemy based on monsterType variable
	createEnemy(x, y, monsterType) {
		let enemy;
		switch (monsterType) {
			case "slime":
				enemy = new Slime(this, x, y, monsterType);
				break;
			case "hound":
				enemy = new Hound(this, x, y, monsterType);
				break;
			case "zombie":
				enemy = new Zombie(this, x, y, monsterType);
				break;
			case "skeleton":
				enemy = new Skeleton(this, x, y, monsterType);
				break;
		}
		this.enemies.push(enemy);
		this.enemyObjects.add(enemy.enemyObject);
	}

	setSelfRecovery() {
		this.recoveryTimer = this.time.addEvent({
			delay: this.levelData.levels[this.playerData.level].healInterval,
			repeat: -1,
			callback: () => {
				this.playerData.health += this.levelData.levels[this.playerData.level].healAmount;
				if (this.playerData.health > this.playerData.maxHealth) this.playerData.health = this.playerData.maxHealth;
				console.log("Healin: " + this.playerData.health);
			},
		});
	}

    createAnimetions() {
		Animations.init.bind(this)();
	}

    levelUp() {
        this.playerData.experience -= this.levelData.levels[this.playerData.level].expNeeded;
        this.playerData.level++;
		if (this.playerData.level >= this.levelData.levels.length) {
			this.playerData.level = this.levelData.levels.length - 1;
		}
        this.playerData.maxHealth = this.levelData.levels[this.playerData.level].maxHealth;
        this.time.removeEvent(this.waveTimer);
        this.time.removeEvent(this.recoveryTimer);
        this.setSelfRecovery();
        this.setEnemySpawn();

        let toUpgrade = this.registry.get("ToUpgrade");
        if (toUpgrade != null) {
            switch (toUpgrade) {
                case "Sword":
                    this.equpmentLevels.sword++;
                    break;
                case "Blade":
                    this.equpmentLevels.blade++;
                    break;
                case "Knife":
                    this.equpmentLevels.knife++;
                    break;
            }
            this.registry.set("equipment", this.equpmentLevels);
            this.registry.set("ToUpgrade", null);
            this.equpmentUpgrade(toUpgrade);
        }

        console.log("Level up: " + this.playerData.level);
    }

    equpmentUpgrade(name) {
        switch (name) {
            case "Sword":
                if (this.equpmentLevels.sword == 1)
                    this.playerData.inventory.push(new Sword(this));
                else {
                    for (let weapon of this.playerData.inventory) {
                        if (weapon.name == name) {
                            weapon.levelUp();
                        }
                    }
                }
                break;
            case "Blade":
                if (this.equpmentLevels.blade == 1)
                    this.playerData.inventory.push(new SpinningBlades(this));
                else {
                    for (let weapon of this.playerData.inventory) {
                        if (weapon.name == name) {
                            weapon.levelUp();
                        }
                    }
                }
                break;
            case "Knife":
                if (this.equpmentLevels.knife == 1)
                    this.playerData.inventory.push(new Knife(this));
                else {
                    for (let weapon of this.playerData.inventory) {
                        if (weapon.name == name) {
                            weapon.levelUp();
                        }
                    }
                }
                break;
        }
    }

}

class LevelUpScene extends Phaser.Scene {
    preload() {
        this.load.image("Sword_1", "assets/weapons/sword_1.png");
        this.load.image("Shuriken", "assets/weapons/Shuriken.png");
        this.load.image("Kunai", "assets/img/Kunai.png");
        this.load.image("bGround", "assets/img/levelUpBG.png");
    }

    init() {
    }

    create() {
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0xffffff);
        this.background = this.add.sprite(0, 0, "bGround").setOrigin(0, 0).setScale(1.0);


        this.choice_1 = this.add.rectangle(64, 535, 334, 130).setInteractive().on("pointerdown", () => {
            this.registry.set("ToUpgrade", "Sword");
            this.scene.switch("Game");
        }).setDepth(2).setOrigin(0, 0);

        this.choice_2 = this.add.rectangle(473, 535, 334, 130).setInteractive().on("pointerdown", () => {
            this.registry.set("ToUpgrade", "Blade");
            this.scene.switch("Game");
        }).setDepth(2).setOrigin(0, 0);

        this.choice_3 = this.add.rectangle(882, 535, 334, 130).setInteractive().on("pointerdown", () => {
            this.registry.set("ToUpgrade", "Knife");
            this.scene.switch("Game");
        }).setDepth(2).setOrigin(0, 0);

        this.add.sprite(124, 605, "Sword_1").setScale(2);
        this.add.text(184, 570, "Sword", { color: "x000", fontSize: "34px" }).setDepth(1);
        this.swordText = this.add.text(184, 610, "1 -> 2", { color: "x000", fontSize: "20px" }).setDepth(1);

        this.add.sprite(533, 605, "Shuriken").setScale(0.030);
        this.add.text(593, 570, ["Shuriken"], { color: "x000", fontSize: "30px" }).setDepth(1);
        this.bladeText = this.add.text(593, 610, "1 -> 2", { color: "x000", fontSize: "20px" }).setDepth(1);

        this.add.sprite(942, 605, "Kunai").setScale(2.5);
        this.add.text(1002, 570, "Kunai", { color: "x000", fontSize: "34px" }).setDepth(1);
        this.knifeText = this.add.text(1002, 610, "1 -> 2", { color: "x000", fontSize: "20px" }).setDepth(1);
    }

    update() {
        this.levels = this.registry.get("equipment");
        if (this.levels.sword == 5) {
            this.swordText.setText("MAX");
            this.choice_1.disableInteractive();
        } else {
            this.swordText.setText(this.levels.sword + " -> " + (this.levels.sword + 1));
            this.choice_1.setInteractive();
        }

        if (this.levels.blade == 5) {
            this.bladeText.setText("MAX");
            this.choice_2.disableInteractive();
        } else {
            this.bladeText.setText(this.levels.blade + " -> " + (this.levels.blade + 1));
            this.choice_2.setInteractive();
        }

        if (this.levels.knife == 5) {
            this.knifeText.setText("MAX");
            this.choice_3.disableInteractive();
        } else {
            this.knifeText.setText(this.levels.knife + " -> " + (this.levels.knife + 1));
            this.choice_3.setInteractive();
        }
    }
}

class MainMenuScene extends Phaser.Scene {
	preload() {
        this.load.image("Title", "assets/img/Title.png");
        this.load.image("playButton", "assets/img/PlayButton.png");
        this.load.image("githubButton", "assets/img/GitHubButton.png");
	}

	create() {
        this.title = this.add.sprite(640, 200, "Title");
		this.choice_1 = this.add.sprite(640, 350, "playButton").setInteractive().on("pointerdown", () => {
			gameScene.scene.restart();
            this.registry.set("equipment", { sword: 0, blade: 0, knife: 1 });
			this.scene.switch("Game");
		});
		this.choice_3 = this.add.sprite(640, 500, "githubButton").setInteractive().on("pointerdown", () => {
			window.open("https://github.com/KissKonradUni/jatekprototipusok_2024_beadando", "_blank");
		});
	}
}

const gameScene = new GameScene("Game");
const levelUpScene = new LevelUpScene("LevelUp");
const mainMenuScene = new MainMenuScene("MainMenu");

const game = new Phaser.Game({
    width: screenSize.x,
    height: screenSize.y,
    scene: [
		mainMenuScene,
        gameScene,
        levelUpScene
    ],
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            //debug: true,
        },
    }
});

Phaser.Canvas.setSmoothingEnabled(game.context, false);