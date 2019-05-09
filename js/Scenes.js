// scene classes

class BaseScene extends Phaser.Scene {
    constructor(id) {
        super(id);
        this.id = id;
        this.tileDataKey;
        this.tileDataSource;
    }

    preload() {
        this.load.tilemapTiledJSON(this.tileDataKey, this.tileDataSource);
        this.load.image('background', 'assets/sprites/background.png');
        this.load.image('switchA', 'assets/sprites/lock_red.png');
        this.load.image('switchB', 'assets/sprites/lock_blue.png');
        this.load.image('switchC', 'assets/sprites/lock_yellow.png');
        this.load.image('switchD', 'assets/sprites/lock_green.png');
        this.load.image('tileset', 'assets/tiles/tile_sheet.png');
        this.load.spritesheet(
            'player',
            'assets/sprites/0x72-industrial-player-32px-extruded.png', {
                frameWidth: 32,
                frameHeight: 32,
                margin: 1,
                spacing: 2
            }
        );
    }

    create() {
		resize();
        var background = this.add.image(config.width / 2, config.height / 2, "background").setScrollFactor(0);
        this.map = this.make.tilemap({ key: this.tileDataKey });
        var tileset = this.map.addTilesetImage('tile_sheet', 'tileset')
        this.map.createStaticLayer('background', tileset, 0, 0);
        this.platforms = this.map.createStaticLayer('platforms', tileset, 0, 0);
        this.map.createStaticLayer('foreground', tileset, 0, 0);

		this.createSwitches();

        this.platforms.setCollisionByProperty({ collides: true });
        this.matter.world.convertTilemapLayer(this.platforms);

		var playerSpawn = this.map.findObject('player', function (object) {
            if (object.name === 'playerSpawn') {
                return object
            }
        });

        this.player = new Player(this, playerSpawn.x, playerSpawn.y);
        this.player.sprite.label = 'player';

        this.keys = this.input.keyboard.addKeys({
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.matter.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
        this.matter.world.on('collisionstart', this.handleCollision, this);
        this.matter.world.on('collisionactive', this.handleCollision, this);
		this.setup();
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.keys.space)) {
            this.switchScene();
        }
        this.player.update();
    }

    handleCollision(event) {
        event.pairs.forEach(this.matchCollisionPair, this);
    }

	createSwitches() {
	    var switchA = this.map.findObject('switches', function (object) {
            if (object.name === 'switchA') {
                return object
            }
        });
        var switchB = this.map.findObject('switches', function (object) {
            if (object.name === 'switchB') {
                return object
            }
        });
        var switchC = this.map.findObject('switches', function (object) {
            if (object.name === 'switchC') {
                return object
            }
        });
        var switchD = this.map.findObject('switches', function (object) {
            if (object.name === 'switchD') {
                return object
            }
        });

        this.switchA = this.matter.add.sprite(switchA.x, switchA.y, 'switchA');
        this.switchB = this.matter.add.sprite(switchB.x, switchB.y, 'switchB');
        this.switchC = this.matter.add.sprite(switchC.x, switchC.y, 'switchC');
        this.switchD = this.matter.add.sprite(switchD.x, switchD.y, 'switchD');

        this.switchA.setStatic(true);
        this.switchA.label = 'switchA';
        this.switchB.setStatic(true);
        this.switchB.label = 'switchB';
        this.switchC.setStatic(true);
        this.switchC.label = 'switchC';
        this.switchD.setStatic(true);
        this.switchD.label = 'switchD';
	}

	setup() {
		switch(this.id) {
			case 'sceneA':
				this.scene.switch('sceneB');
				break;
			case 'sceneB':
				this.scene.switch('sceneA');
				break;
		}
	}

    switchScene(player, switchButton) {
        switch (this.id) {
            case 'sceneA':
				newScene = scenes[1];
                this.scene.switch('sceneB');
                break;
            case 'sceneB':
				newScene = scenes[0];
                this.scene.switch('sceneA');
                break;
        }
		this.playerPosition(player, switchButton);
    }

	playerPosition(player, switchButton) {
		if (newScene.switchA.label == lastSwitch) {
			switchButton = newScene.switchA;
		} else if (newScene.switchB.label == lastSwitch) {
			switchButton = newScene.switchB;
		} else if (newScene.switchC.label == lastSwitch) {
			switchButton = newScene.switchC;
		} else if (newScene.switchD.label == lastSwitch) {
			switchButton = newScene.switchD;
		}
		newScene.player.sprite.x = switchButton.x;
		newScene.player.sprite.y = switchButton.y - 70;
	}

	matchCollisionPair(pair) {
		const bodyA = pair.bodyA;
		const bodyB = pair.bodyB;
		let myPair = [null, null];
		let scene = this;
		if (bodyA.gameObject && bodyA.gameObject.label) {
			this.sortCollisionObjects(bodyA.gameObject.label, myPair);
		}
		if (bodyB.gameObject && bodyB.gameObject.label) {
			this.sortCollisionObjects(bodyB.gameObject.label, myPair);
		}
		if (myPair[0] == 'player') {
			if (myPair[1] == 'switchA' && lastSwitch != 'switchA') {
				lastSwitch = 'switchA';
				this.switchScene(this.player, scene.switchA);
			} else if (myPair[1] == 'switchB' && lastSwitch != 'switchB') {
				lastSwitch = 'switchB';
				this.switchScene(this.player, scene.switchB);
			} else if (myPair[1] == 'switchC' && lastSwitch != 'switchC') {
				lastSwitch = 'switchC';
				this.switchScene(this.player, scene.switchC);
			} else if (myPair[1] == 'switchD' && lastSwitch != 'switchD') {
				lastSwitch = 'switchD';
				this.switchScene(this.player, scene.switchD);
			}
		}
	}

	sortCollisionObjects(label, array) {
		switch (label) {
			case 'player':
				array[0] = 'player';
				break;
			case 'switchA':
				array[1] = 'switchA';
				break;
			case 'switchB':
				array[1] = 'switchB';
				break;
			case 'switchC':
				array[1] = 'switchC';
				break;
			case 'switchD':
				array[1] = 'switchD';
				break;
		}
	}
}

class SceneA extends BaseScene {
    constructor() {
        super('sceneA');
        this.tileDataKey = 'level1';
        this.tileDataSource = 'assets/tiles/level1.json';
		scenes.push(this);
    }

    preload() {
        super.preload();
    }

    create() {
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);
    }
}

class SceneB extends BaseScene {
    constructor() {
        super('sceneB');
        this.tileDataKey = 'level2';
        this.tileDataSource = 'assets/tiles/level2.json';
		scenes.push(this);
    }

    preload() {
        super.preload();
    }

    create() {
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);
    }
}

// global functions
function matchCollisionPair(pair) {
    const bodyA = pair.bodyA;
    const bodyB = pair.bodyB;
    let myPair = [null, null];
	let scene = this;
    if (bodyA.gameObject && bodyA.gameObject.label) {
        sortCollisionObjects(bodyA.gameObject.label, myPair);
    }
    if (bodyB.gameObject && bodyB.gameObject.label) {
        sortCollisionObjects(bodyB.gameObject.label, myPair);
    }
    if (myPair[0] == 'player') {
        if (myPair[1] == 'switchA' && lastSwitch != 'switchA') {
			lastSwitch = 'switchA';
            this.switchScene(this.player, scene.switchA);
        } else if (myPair[1] == 'switchB' && lastSwitch != 'switchB') {
			lastSwitch = 'switchB';
            this.switchScene(this.player, scene.switchB);
        } else if (myPair[1] == 'switchC' && lastSwitch != 'switchC') {
			lastSwitch = 'switchC';
            this.switchScene(this.player, scene.switchC);
        } else if (myPair[1] == 'switchD' && lastSwitch != 'switchD') {
			lastSwitch = 'switchD';
            this.switchScene(this.player, scene.switchD);
        }
    }
}

function sortCollisionObjects(label, array) {
    switch (label) {
        case 'player':
            array[0] = 'player';
            break;
        case 'switchA':
            array[1] = 'switchA';
            break;
        case 'switchB':
            array[1] = 'switchB';
            break;
        case 'switchC':
            array[1] = 'switchC';
            break;
        case 'switchD':
            array[1] = 'switchD';
            break;
    }
}