import type { ReactiveControllerHost } from 'lit'

export class Ui {
  ui: ReactiveControllerHost

  constructor(uiHost: ReactiveControllerHost) {
    this.ui = uiHost
  }

  /**
   * Request update - Lit
   */
  update(): void {
    this.ui?.requestUpdate()
  }
}
