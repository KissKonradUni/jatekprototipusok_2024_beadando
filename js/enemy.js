const enemyAttributes = {
    speed:          128, // How fast the enemy moves
    health:         100, // How much health the enemy has
    stunTime:       200, // (ms) How long the enemy is stunned after being hit
    damage:         10,  // How much damage it couse on attack
};

// TODO: Add variatons, elites, damage player on contact, etc.
class Enemy {

    constructor(scene, x, y, text = "Enemy") {
        this.scene = scene;

        this.properties = {...enemyAttributes};
        this.lastDamaged = 0;

        // TODO: Replace with sprite
        this.enemyObject = scene.add.text(x, y, text, { fontSize: "32px", fill: "#f00", fontFamily: "Noto Sans" });
        scene.physics.add.existing(this.enemyObject);
        scene.enemyObjects.add(this.enemyObject);
        
        this.enemyObject.body.setDrag(0.01);
        this.enemyObject.body.useDamping = true;

        this.enemyObject.wrapper = this;
    }

    update() {
        const playerPos = this.scene.player.body.position;
        const enemyPos  = this.enemyObject.body.position;

        let direction = playerPos.clone().subtract(enemyPos);
        direction.normalize();
        direction.scale(this.properties.speed);

        if (this.lastDamaged + this.properties.stunTime > this.scene.time.now) {
            direction.scale(-1);
        }

        this.enemyObject.body.setVelocity(direction.x, direction.y);
    }

    damage(amount) {
        this.properties.health -= amount;
        if (this.properties.health <= 0) {
            this.die();
            return;
        }

        // Knockback
        this.lastDamaged = this.scene.time.now;

        console.log("OWIE! " + this.properties.health);
    }

    die() {
        this.scene.enemyObjects.remove(this.enemyObject);
        this.scene.enemies.splice(this.scene.enemies.indexOf(this), 1);
        this.enemyObject.destroy();
    }

}

class Hound extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, "Hound");
        this.properties = {
            speed:          256,
            health:         50,
            stunTime:       400,
            damage:         15,
        }
    }
}

class Slime extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, "Slime");
        this.properties = {
            speed:          96,
            health:         140,
            stunTime:       200,
            damage:         5,
        }
    }
}

class Skeleton extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, "Skeleton");
        this.properties = {
            speed:          128,
            health:         80,
            stunTime:       100,
            damage:         10,
        }
    }
}

class Zombie extends Enemy {

    constructor(scene, x, y) {
        super(scene, x, y, "Zombie");
        this.properties = {
            speed:          100,
            health:         100,
            stunTime:       300,
            damage:         12,
        }
    }
}