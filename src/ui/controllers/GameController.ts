import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { Game } from '../../game/Game'

export class GameController implements ReactiveController {
  host: ReactiveControllerHost

  gameInstance: Game | undefined
  context: CanvasRenderingContext2D | undefined

  constructor(host: ReactiveControllerHost) {
    ;(this.host = host).addController(this)
  }

  public setContext(context: CanvasRenderingContext2D) {
    this.context = context
  }

  public init() {
    if (!this.context) {
      throw new Error('Canvas context not defined')
    }

    this.gameInstance = new Game(this.context)
  }

  hostDisconnected() {
    delete this.gameInstance
  }
}
