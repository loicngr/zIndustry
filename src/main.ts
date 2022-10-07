import {html, LitElement} from 'lit'
import {customElement} from 'lit/decorators.js'
import './components/KeyboardElement'
import './components/CanvasElement'
import {GameController} from "./controllers/GameController"

import './style.css'

@customElement('game-element')
class GameElement extends LitElement {
    private gameController: GameController
    private readonly currentWindow: Window

    constructor(currentWindow: Window) {
        super()

        this.currentWindow = currentWindow
        this.gameController = new GameController(this)
    }

    connectedCallback() {
        super.connectedCallback()
    }

    updateCanvasContext(e: CustomEvent): void {
        this.gameController.setContext(e.detail)
        this.gameController.init()

        this.gameController?.gameInstance?.run()
    }

    protected render(): unknown {
        return html`
            <keyboard-element></keyboard-element>
            <canvas-element
                    currentWindow="${this.currentWindow}"
                    @update-canvas-context="${this.updateCanvasContext}"
            ></canvas-element>
        `
    }
}

window.onload = () => {
    new GameElement(window)
}