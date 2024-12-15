const weaponAttributes = {
    attackInterval: 3000, // ms
    attackLength:   1000, // ms
    attackDamage:   10,
    attackRange:    64,
};

// TODO: Add variatons
class Sword {

    constructor(scene) {
        this.scene = scene;

        this.properties = weaponAttributes;
        this.properties.name = "Sword";

        // TODO: Replace with sprite
        this.weaponSprite = scene.add.text(0, 0, "Sword", { fontSize: "48px", fill: "#f00", fontFamily: "Noto Sans", align: "center" }).setOrigin(0.5);
        this.weaponSprite.wrapper = this;
        
        scene.physics.add.existing(this.weaponSprite);
        scene.weaponAttacks.add(this.weaponSprite);
        this.weaponSprite.body.setCircle(this.weaponSprite.width / 2, 0, -this.weaponSprite.width / 4);

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

        const direction = this.weaponSprite.rotation;
        const distance = this.properties.attackRange;

        const x = player.x + distance * Math.cos(direction);
        const y = player.y + distance * Math.sin(direction);

        this.weaponSprite.setPosition(x, y);
    }

}