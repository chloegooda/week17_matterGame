// player class

class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.matter.add
            .sprite(0, 0, "player", 0)
            .setBody({ type: "circle", radius: 14 })
            .setScale(2)
            .setFixedRotation()
            .setPosition(x, y)
            .setBounce(0.01)
            .setFriction(0.001)
        this.keys = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.scene.input.on('pointerdown', this.handlePointerDown, this);
        this.scene.input.on('pointerup', this.handlePointerUp, this);
        this.xForce = 0.1;
        this.yForce = 0.1;
        this.isTouching = false;
        this.touchData = {};
    }

    handlePointerDown(pointer) {
        this.touchData.startX = pointer.x;
        this.touchData.startY = pointer.y;
    }

    handlePointerUp(pointer) {
        this.touchData.endX = pointer.x;
        this.touchData.endY = pointer.y;
        this.handleTouch();
    }

    handleTouch() {
        const distX = this.touchData.endX - this.touchData.startX;
        const distY = this.touchData.endY - this.touchData.startY;
        this.touchData = {};
        const tolerance = 10;
        if (distX > 0 + tolerance) {
            this.moveRight = true;
        } else if (distX < 0 - tolerance) {
            this.moveLeft = true;
        }
        if (distY < 0 - tolerance) {
            this.jumpUp = true;
        }
    }

    freeze() {
        this.sprite.setStatic(true);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {
            this.moveRight = true;
        } else if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {
            this.moveLeft = true;
        }
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            this.jumpUp = true;
        }

        if (this.moveRight) {
            this.sprite.applyForce({
                x: this.xForce,
                y: 0
            });
        } else if (this.moveLeft) {
            this.sprite.applyForce({
                x: -this.xForce,
                y: 0
            })
        }
        if (this.jumpUp) {
            this.sprite.applyForce({
                x: 0,
                y: -this.yForce
            })
        }

        const clamp = 5;
        if (this.sprite.body.velocity.x > clamp) {
            this.sprite.setVelocityX(clamp);
        } else if (this.sprite.body.velocity.x < -clamp) {
            this.sprite.setVelocityX(-clamp);
        }

        this.moveRight = this.moveLeft = this.jumpUp = false;
    }

    destroy() {

    }
}