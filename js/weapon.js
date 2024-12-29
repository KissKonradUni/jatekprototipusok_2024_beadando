const weaponAttributes = {
    attackInterval: 3000, // ms
    attackLength: 1000, // ms
    attackDamage: 50,
    attackRange: 64,
};

class Sword {

    constructor(scene) {
        this.scene = scene;
        this.level = 1;
        this.properties = weaponAttributes;
        this.properties.name = "Sword";

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
        this.attackTimer = scene.time.addEvent({
            delay: this.properties.attackInterval,
            callback: () => {
                this.attack();
                console.log("WHUZZZA! " + this.properties.name);
            },
            loop: true,
        });
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
    }

}
class SpinningBlades {
    constructor(scene) {
        this.scene = scene;

        this.properties = weaponAttributes;
        this.properties.name = "Spinning Blade";
        this.properties.attackRange = 100;
        this.level = 1;
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
        this.numbers++;
        this.blades.push(new SpinningBlade(this.scene, this));
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
}

class Knife {
    constructor(scene) {
        this.scene = scene;
        this.level = 1;
        this.speed = 400;
        this.properties = weaponAttributes;
        this.properties.name = "Knife";
        this.enemyPositions = [];
        this.isDisabled=true;

        // TODO: Replace with sprite
        this.weaponSprite = scene.add.sprite(0, 0, "Sword_1").setScale(0.8);
        this.weaponSprite.wrapper = this;

        scene.physics.add.existing(this.weaponSprite);
        scene.weaponAttacks.add(this.weaponSprite);
        this.weaponSprite.body.setCircle(this.weaponSprite.width, 0, -this.weaponSprite.width / 2);

        // hide the weapon sprite by default
        this.weaponSprite.setVisible(false);
        this.weaponSprite.body.enable = false;

        // create timer for weapon attack interval
        this.attackTimer = scene.time.addEvent({
            delay: this.properties.attackInterval,
            callback: () => {
                this.attack();
                console.log("WHUZZZA! " + this.properties.name);
            },
            loop: true,
        });
    }

    attack() {
        this.isDisabled=false;
        this.weaponSprite.setVisible(true);
        this.weaponSprite.body.enable = true;

        this.weaponSprite.copyPosition(this.scene.player);

    }

    update() {
        if(this.isDisabled){
            this.weaponSprite.setVisible(false);
            this.weaponSprite.body.enable = false;
        }
        if (this.scene.closest != null && !this.isDisabled) {
            this.knifePos = this.weaponSprite.body.position;
            let direction = this.scene.closest.body.position.clone().subtract(this.knifePos);
            direction.normalize().scale(this.speed);
            this.weaponSprite.body.setVelocity(direction.x, direction.y);
        }
    }

    levelUp() {
        if (this.level < 5)
            this.level++;
        this.weaponSprite.setTexture("Sword_" + this.level);
    }

}
