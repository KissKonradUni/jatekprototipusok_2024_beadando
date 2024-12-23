class Animations {
	static init() {
		//run
		this.anims.create({
			key: "rUp",
			frames: this.anims.generateFrameNames("rUp", {
				frames: [0, 1, 2, 3, 4, 5, 6, 7],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: 0,
		});
		this.anims.create({
			key: "rDown",
			frames: this.anims.generateFrameNames("rDown", {
				frames: [0, 1, 2, 3, 4, 5, 6, 7],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: 0,
		});
		this.anims.create({
			key: "rLeft",
			frames: this.anims.generateFrameNames("rLeft", {
				frames: [0, 1, 2, 3, 4, 5, 6, 7],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: 0,
		});
		this.anims.create({
			key: "rRight",
			frames: this.anims.generateFrameNames("rRight", {
				frames: [0, 1, 2, 3, 4, 5, 6, 7],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: 0,
		});

		//idle
		this.anims.create({
			key: "iRight",
			frames: this.anims.generateFrameNames("iRight", {
				frames: [0, 1, 2, 3],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: -1,
		});
		this.anims.create({
			key: "iLeft",
			frames: this.anims.generateFrameNames("iLeft", {
				frames: [0, 1, 2, 3],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: -1,
		});
		this.anims.create({
			key: "iUp",
			frames: this.anims.generateFrameNames("iUp", {
				frames: [0, 1, 2, 3],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: -1,
		});
		this.anims.create({
			key: "iDown",
			frames: this.anims.generateFrameNames("iDown", {
				frames: [0, 1, 2, 3],
			}),
			frameRate: 12,
			yoyo: true,
			repeat: -1,
		});

		//death
		this.anims.create({
			key: "dRight",
			frames: this.anims.generateFrameNames("dRight", {
				frames: [0, 1, 2, 3, 4, 5, 6],
			}),
			frameRate: 12,
			yoyo: false,
			repeat: 0,
		});
		this.anims.create({
			key: "dLeft",
			frames: this.anims.generateFrameNames("dLeft", {
				frames: [0, 1, 2, 3, 4, 5, 6],
			}),
			frameRate: 12,
			yoyo: false,
			repeat: 0,
		});
		this.anims.create({
			key: "dUp",
			frames: this.anims.generateFrameNames("dUp", {
				frames: [0, 1, 2, 3, 4, 5, 6],
			}),
			frameRate: 12,
			yoyo: false,
			repeat: 0,
		});
		this.anims.create({
			key: "dDown",
			frames: this.anims.generateFrameNames("dDown", {
				frames: [0, 1, 2, 3, 4, 5, 6],
			}),
			frameRate: 12,
			yoyo: false,
			repeat: 0,
		});

		//taking damage
		this.anims.create({
			key: "hRight",
			frames: this.anims.generateFrameNames("hRight", {
				frames: [0, 1, 2, 3, 4],
			}),
			duration: 100,
			yoyo: false,
			repeat: 0,
		});
		this.anims.create({
			key: "hLeft",
			frames: this.anims.generateFrameNames("hLeft", {
				frames: [0, 1, 2, 3, 4],
			}),
			duration: 100,
			yoyo: false,
			repeat: 0,
		});
		this.anims.create({
			key: "hUp",
			frames: this.anims.generateFrameNames("hUp", {
				frames: [0, 1, 2, 3, 4],
			}),
			duration: 100,
			yoyo: false,
			repeat: 0,
		});
		this.anims.create({
			key: "hDown",
			frames: this.anims.generateFrameNames("hDown", {
				frames: [0, 1, 2, 3, 4],
			}),
			duration: 100,
			yoyo: false,
			repeat: 0,
		});

		//monster animations
		this.anims.create({
			key: "slimeMove",
			frames: this.anims.generateFrameNames("slime", {
				frames: [0, 1, 2, 3],
			}),
			duration: 300,
			repeat: -1,
		});
		this.anims.create({
			key: "skeletonMove",
			frames: this.anims.generateFrameNames("skeleton", {
				frames: [0, 1, 2],
			}),
			duration: 300,
			repeat: -1,
		});
		this.anims.create({
			key: "zombieMove",
			frames: this.anims.generateFrameNames("zombie", {
				frames: [0, 1, 2],
			}),
			duration: 300,
			repeat: -1,
		});
		this.anims.create({
			key: "houndMove",
			frames: this.anims.generateFrameNames("hound", {
				frames: [0, 1, 2, 3, 4],
			}),
			duration: 300,
			repeat: -1,
		});
	}
}
