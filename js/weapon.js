
class Sword {

    constructor(scene) {
        this.scene = scene;
        this.level = 1;
        this.properties = this.scene.weaponData.Sword[this.level-1];
        this.name = "Sword";

        // TODO: Replace with sprite
        this.weaponSprite = scene.add.sprite(0, 0, "Sword_1").setScale(2).setOrigin(0.5);
        this.weaponSprite.wrapper = this;

        scene.physics.add.existing(this.weaponSprite);
        scene.weaponAttacks.add(this.weaponSprite);
        this.weaponSprite.body.setCircle(this.weaponSprite.width, 0, -this.weaponSprite.width / 2);


		// hide the weapon sprite by default
		this.weaponSprite.setVisible(false);
		this.weaponSprite.body.enable = false;

        // create timer for weapon attack interval
        this.createTimer();
    }
	attack() {
		const player = this.scene.player;
		this.weaponSprite.copyPosition(player);
		this.timeOffset = this.scene.time.now;

		this.weaponSprite.setVisible(true);
		this.weaponSprite.body.enable = true;

		this.scene.time.delayedCall(this.properties.attackLength, () => {
			this.weaponSprite.setVisible(false);
			this.weaponSprite.body.enable = false;
		});
	}
    update() {
        this.weaponSprite.rotation = 0.031415 * (this.scene.time.now - this.timeOffset);

        const player = this.scene.player;
        this.weaponSprite.setPosition(player.x, player.y);

        const direction = this.weaponSprite.rotation - 0.5;
        const distance = this.properties.attackRange;

		const x = player.x + distance * Math.cos(direction);
		const y = player.y + distance * Math.sin(direction);
        this.weaponSprite.setPosition(x, y);
	}
    levelUp() {
        if (this.level < 5)
            this.level++;
        this.weaponSprite.setTexture("Sword_" + this.level);
        this.properties=this.scene.weaponData.Sword[this.level-1];
        this.scene.time.removeEvent(this.attackTimer);
        this.createTimer();
    }
    createTimer(){
        this.attackTimer = this.scene.time.addEvent({
            delay: this.properties.attackInterval,
            callback: () => {
                this.attack();
                console.log("WHUZZZA! " + this.name);
            },
            loop: true,
        });
    }

}

class SpinningBlades {
    constructor(scene) {
        this.scene = scene;
        this.level = 1;
        this.properties = this.scene.weaponData.spinningBlade[this.level-1];
        this.name = "Blade";
        this.properties.attackRange = 100;
        this.wrapper = this;

        this.blades = []
        this.blades.push(new SpinningBlade(this.scene, this));
    }

    update() {
        let number = 0
        for (let blade of this.blades) {
            blade.update(number);
            number++;
        }
    }

    levelUp() {
        if(this.level<5)
            this.level++;
        this.blades.push(new SpinningBlade(this.scene, this));
        for (let blade of this.blades) {
            blade.sizeUp();
        }
    }
}
class SpinningBlade {

    constructor(scene, wrapperClass) {
        this.wrapperClass = wrapperClass;
        this.scene = scene;

        // TODO: Replace with sprite
        this.weaponSprite = scene.add.sprite(0, 0, "Shuriken").setScale(0.01);
        this.weaponSprite.wrapper = wrapperClass;

        scene.physics.add.existing(this.weaponSprite);
        scene.weaponAttacks.add(this.weaponSprite);
        this.weaponSprite.body.setCircle(this.weaponSprite.width / 1.8, 0, 0);

        this.weaponSprite.setVisible(true);
        this.weaponSprite.body.enable = true;
    }

    update(number) {
        this.offSetAngle = (20 * 3.14) / this.wrapperClass.level * number;
        let currentAngle = 0.031415 * this.scene.time.now + this.offSetAngle;
        const player = this.scene.player;

        this.weaponSprite.rotation = currentAngle;
        this.weaponSprite.setPosition(player.x, player.y);

        const direction = currentAngle * 0.1;
        const distance = this.wrapperClass.properties.attackRange;

        const x = player.x + distance * Math.cos(direction);
        const y = player.y + distance * Math.sin(direction);

        this.weaponSprite.setPosition(x, y);

    }

    sizeUp(){
        this.weaponSprite.setScale(0.01+this.wrapperClass.level/500);
    }
}

class Knife {
    constructor(scene) {
        this.scene = scene;
        this.level = 1;
        this.throwable=this.level;
        this.properties = this.scene.weaponData.Knife[this.level-1];
        this.name = "Knife";
        this.enemyPositions = [];
        this.isDisabled=true;

        // TODO: Replace with sprite
        this.weaponSprite = scene.add.sprite(0, 0, "Sword_1").setScale(0.8);
        this.weaponSprite.rotation=-3.14*20/8.9;
        this.weaponSprite.wrapper = this;

        scene.physics.add.existing(this.weaponSprite);
        scene.weaponAttacks.add(this.weaponSprite);
        this.weaponSprite.body.setCircle(this.weaponSprite.width, 0, -this.weaponSprite.width / 2);

        // hide the weapon sprite by default
        this.weaponSprite.setVisible(false);
        this.weaponSprite.body.enable = false;

        // create timer for weapon attack interval
        this.createTimer();
    }

    attack() {
        if(this.throwable==0){
            this.throwable=this.level;
        }
        this.throwable--;
        this.isDisabled=false;
        this.weaponSprite.setVisible(true);
        this.weaponSprite.body.enable = true;

        this.weaponSprite.copyPosition(this.scene.player);
        this.aimedEnemy=this.scene.closest;
    }

    update() {
        if(this.isDisabled){
            this.weaponSprite.setVisible(false);
            this.weaponSprite.body.enable = false;
        }
        if (this.aimedEnemy != null && !this.isDisabled) {
            if(this.aimedEnemy.body==null)
            {
                this.throwable++;
                this.attack();
            }
            this.knifePos = this.weaponSprite.body.position;
            let direction = this.aimedEnemy.body.position.clone().subtract(this.knifePos);
            direction.normalize().scale(this.properties.speed);
            this.weaponSprite.rotation=-3.14*20/8.9+direction.angle()+3.14*2.5;
            this.weaponSprite.body.setVelocity(direction.x, direction.y);
        }
    }

    levelUp() {
        if (this.level < 5)
            this.level++;
        this.properties = this.scene.weaponData.Knife[this.level-1];
        this.weaponSprite.setTexture("Sword_" + this.level);
        this.scene.time.removeEvent(this.attackTimer);
        this.createTimer();
    }

    createTimer(){
        this.attackTimer = this.scene.time.addEvent({
            delay: this.properties.attackInterval,
            callback: () => {
                if (this.scene.closest != null )
                    this.attack();
                console.log("WHUZZZA! " + this.properties.name);
            },
            loop: true,
        });
    }
}
