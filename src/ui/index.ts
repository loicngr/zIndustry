import { customElement } from 'lit/decorators.js'
import { html, LitElement } from 'lit'
import type { TemplateResult } from 'lit'

// CustomElements
import './components/KeyboardElement'
import './components/CanvasElement'
import './components/ActionBar'

// Controllers
import { GameController } from './controllers/GameController'

@customElement('game-element')
export class GameElement extends LitElement {
  private gameController: GameController
  private gameReady = false

  constructor() {
    super()

    this.gameController = new GameController(this)
  }

  connectedCallback() {
    super.connectedCallback()
  }

  updateCanvasContext(e: CustomEvent): void {
    this.gameController.setContext(e.detail)
    this.gameController.init()

    this.gameController?.gameInstance?.run().then(() => {
      this.gameReady = true
      this.requestUpdate()
    })
  }

  private static get commonTemplate(): TemplateResult {
    return html`<keyboard-element></keyboard-element>`
  }

  private get canvasTemplate(): TemplateResult {
    return html`<canvas-element @update-canvas-context="${this.updateCanvasContext}"></canvas-element>`
  }

  private get getGameReadyTemplate(): TemplateResult {
    return this.gameReady
      ? html`<action-bar-element actionBar="${JSON.stringify(this.gameController.characterActionBar)}"></action-bar-element>`
      : html``
  }

  protected render(): unknown {
    return html` ${GameElement.commonTemplate} ${this.getGameReadyTemplate} ${this.canvasTemplate} `
  }
}
