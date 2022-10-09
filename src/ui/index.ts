import {customElement} from "lit/decorators.js"
import {html, LitElement} from "lit"

// CustomElements
import './components/KeyboardElement'
import './components/CanvasElement'

// Controllers
import {GameController} from "./controllers/GameController"

@customElement('game-element')
export class GameElement extends LitElement {
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