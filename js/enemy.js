const enemyAttributes = {
    speed: 128,
};

// TODO: Add variatons, elites, damage player on contact, etc.
class Enemy {

    constructor(scene, x, y) {
        this.scene = scene;

        // TODO: Replace with sprite
        this.enemyObject = scene.add.text(x, y, "Enemy", { fontSize: "32px", fill: "#f00", fontFamily: "Noto Sans" });
        scene.physics.add.existing(this.enemyObject);
        scene.enemyObjects.add(this.enemyObject);
        
        //this.enemyObject.body.useDamping = true;
        this.enemyObject.body.setDrag(0.01);
        this.enemyObject.body.useDamping = true;
    }

    update() {
        const playerPos = this.scene.player.body.position;
        const enemyPos  = this.enemyObject.body.position;

        let direction = playerPos.clone().subtract(enemyPos);
        direction.normalize();
        direction.scale(enemyAttributes.speed);

        this.enemyObject.body.setVelocity(direction.x, direction.y);
    }

}