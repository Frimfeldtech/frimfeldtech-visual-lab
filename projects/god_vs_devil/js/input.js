export class InputHandler {
    constructor() {
        this.keys = {};
        this.gamepads = {};
        this.actions = {
            p1: { up: false, down: false, left: false, right: false, punch: false, kick: false, special: false, start: false, lb: false, rb: false, lt: false, rt: false, block: false },
            p2: { up: false, down: false, left: false, right: false, punch: false, kick: false, special: false, start: false, block: false }
        };

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        window.addEventListener('gamepadconnected', (e) => this.connectGamepad(e));
        window.addEventListener('gamepaddisconnected', (e) => this.disconnectGamepad(e));
    }

    onKeyDown(e) {
        this.keys[e.code] = true;
    }

    onKeyUp(e) {
        this.keys[e.code] = false;
    }

    connectGamepad(e) {
        console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
            e.gamepad.index, e.gamepad.id,
            e.gamepad.buttons.length, e.gamepad.axes.length);
        this.gamepads[e.gamepad.index] = e.gamepad;
    }

    disconnectGamepad(e) {
        delete this.gamepads[e.gamepad.index];
    }

    update() {
        // Poll gamepads
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];

        // Player 1 (Keyboard + Gamepad 0)
        this.actions.p1.up = this.keys['ArrowUp'] || this.keys['KeyW'] || this.gamepadPressed(pads[0], 12); // D-pad Up
        this.actions.p1.down = this.keys['ArrowDown'] || this.keys['KeyS'] || this.gamepadPressed(pads[0], 13); // D-pad Down
        this.actions.p1.left = this.keys['ArrowLeft'] || this.keys['KeyA'] || this.gamepadPressed(pads[0], 14); // D-pad Left
        this.actions.p1.right = this.keys['ArrowRight'] || this.keys['KeyD'] || this.gamepadPressed(pads[0], 15); // D-pad Right

        this.actions.p1.punch = this.keys['KeyJ'] || this.keys['KeyZ'] || this.gamepadPressed(pads[0], 2); // X (Xbox)
        this.actions.p1.kick = this.keys['KeyK'] || this.keys['KeyX'] || this.gamepadPressed(pads[0], 0); // A (Xbox)
        this.actions.p1.special = this.keys['KeyL'] || this.keys['KeyC'] || this.gamepadPressed(pads[0], 3); // Y (Xbox)
        this.actions.p1.start = this.keys['Enter'] || this.gamepadPressed(pads[0], 9); // Start

        // Shoulder Buttons for Charge Powers
        this.actions.p1.lb = this.keys['KeyQ'] || this.gamepadPressed(pads[0], 4);
        this.actions.p1.rb = this.keys['KeyE'] || this.gamepadPressed(pads[0], 5);
        this.actions.p1.lt = this.keys['KeyU'] || this.gamepadPressed(pads[0], 6);
        this.actions.p1.rt = this.keys['KeyI'] || this.gamepadPressed(pads[0], 7);

        // Block (Hold Back or specific button, let's map to Shift or B button)
        this.actions.p1.block = this.keys['ShiftLeft'] || this.gamepadPressed(pads[0], 1); // B (Xbox)

        // Player 2 (Numpad + Gamepad 1) - Optional for local multiplayer
        // Simplified for now, P2 usually AI or Gamepad 2
        if (pads[1]) {
            this.actions.p2.up = this.gamepadPressed(pads[1], 12);
            this.actions.p2.down = this.gamepadPressed(pads[1], 13);
            this.actions.p2.left = this.gamepadPressed(pads[1], 14);
            this.actions.p2.right = this.gamepadPressed(pads[1], 15);
            this.actions.p2.punch = this.gamepadPressed(pads[1], 2);
            this.actions.p2.kick = this.gamepadPressed(pads[1], 0);
            this.actions.p2.special = this.gamepadPressed(pads[1], 3);
            this.actions.p2.block = this.gamepadPressed(pads[1], 1);
        }
    }

    gamepadPressed(pad, buttonIndex) {
        if (!pad || !pad.buttons[buttonIndex]) return false;
        return pad.buttons[buttonIndex].pressed;
    }
}
