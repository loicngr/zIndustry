import { Ui } from './Ui'

export class Pause {
  private _status: boolean
  ui: Ui

  constructor(ui: Ui) {
    this.ui = ui
    this._status = false
  }

  get status(): boolean {
    return this._status
  }

  set status(v: boolean) {
    this._status = v
    this.ui.update()
  }
}
