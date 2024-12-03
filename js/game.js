/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {

    preload() {

    }

    create() {

    }

    init() {

    }

}

const gameScene = new GameScene("Game");
const game = new Phaser.Game({
    width: 1280,
    height: 720,
    scene: [
        gameScene,
    ],
});