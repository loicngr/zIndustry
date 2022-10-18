import type { ReactiveController, ReactiveControllerHost } from 'lit'
import { Game } from '../../game/Game'
import { TInventory } from '../../game/types/inventory'
import { TActionBar } from '../../game/types/actionBar'
import { TPosition } from '../../game/types/common'

export class GameController implements ReactiveController {
  host: ReactiveControllerHost
  gameInstance: Game | undefined
  context: CanvasRenderingContext2D | undefined

  constructor(host: ReactiveControllerHost) {
    this.host = host

    host.addController(this)
  }

  public setCanvasContext(context: CanvasRenderingContext2D) {
    this.context = context
  }

  public init() {
    if (!this.context) {
      throw new Error('Canvas context not defined')
    }

    this.gameInstance = new Game(this.context, this.host)
  }

  public get characterInventory(): TInventory | undefined {
    return this.gameInstance?.character?.inventory
  }

  public get characterActionBar(): TActionBar | undefined {
    return this.gameInstance?.character?.actionBar
  }

  public get isGamePaused(): boolean {
    return this.gameInstance?.pause?.status ?? false
  }

  public get floatingTexts(): { text: string; at: TPosition }[] | undefined {
    return this.gameInstance?.floatingTexts.elements
  }

  hostDisconnected() {
    delete this.gameInstance
  }
}
