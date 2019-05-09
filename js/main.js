var config = {
    type: Phaser.AUTO,
    width: 70 * 8,
    height: 70 * 12,
    pixelArt: false,
    backgroundColor: '#000000',

    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: {
                x: 0,
                y: 1.5
            }
        }
    },
    scene: [SceneA, SceneB],
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin,
                key: "matterCollision",
                mapping: "matterCollision"
            }
        ]
    }
};

var game = new Phaser.Game(config);
var lastSwitch, newScene;
var scenes = [];

function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    } else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}