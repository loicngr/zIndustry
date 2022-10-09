import safeGet from "lodash/get"
import {TKeyboard} from "./types/common"

export class Keyboard {
    private readonly keys: TKeyboard

    constructor() {
        this.keys = {}
    }

    public listenForEvents(keys: string[]) {
        window.addEventListener('keydown', this.onKeyDown.bind(this))
        window.addEventListener('keyup', this.onKeyUp.bind(this))

        keys.forEach(k => this.keys[k] = false)
    }

    public isPressed(key: string): boolean {
        return safeGet(this.keys, key, false)
    }

    public resetKey(key: string): void {
        this.keys[key] = false
    }

    private onKeyDown(event: KeyboardEvent) {
        const code = event.code

        if (code in this.keys) {
            event.preventDefault()
            this.keys[code] = true
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        const code = event.code

        if (code in this.keys) {
            event.preventDefault()
            this.keys[code] = false
        }
    }
}