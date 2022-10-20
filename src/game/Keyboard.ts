import safeGet from 'lodash/get'
import { TKeyboard, TKeyboardEvent } from './types/common'
import { EMouseKey, EMouseKeyBinding, EWheelKey, EWheelKeyBinding } from './enums/key'
import { devLog } from './utils'

export class Keyboard {
  private readonly keys: TKeyboard
  private readonly keysEvents: TKeyboardEvent

  constructor() {
    this.keys = {}
    this.keysEvents = {}
  }

  public listenForWheelEvents(keys: EWheelKey[]): void {
    keys.forEach((k) => {
      this.keys[k] = false
      window.addEventListener(k, this[EWheelKeyBinding[k]].bind(this))
    })
  }

  public listenForMouseEvents(keys: EMouseKey[]): void {
    keys.forEach((k) => {
      this.keys[k] = false
      window.addEventListener(k, this[EMouseKeyBinding[k]].bind(this))
    })
  }

  public listenForEvents(keys: string[]): void {
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))

    keys.forEach((k) => (this.keys[k] = false))
  }

  public isPressed(key: string): boolean {
    return safeGet(this.keys, key, false)
  }

  public resetKey(key: string): void {
    this.keys[key] = false
  }

  private [EWheelKeyBinding.wheel](event: WheelEvent): void {
    const type = event.type

    if (type in this.keys) {
      this.keys[type] = true
      this.keysEvents[type] = event
      devLog('wheel')
    }
  }

  private [EMouseKeyBinding.mousedown](event: MouseEvent): void {
    const type = event.type

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = true
      this.keys['click'] = false
      devLog('mouse down')
    }
  }

  private [EMouseKeyBinding.mouseup](event: MouseEvent): void {
    const type = 'mousedown'

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = false
      devLog('mouse up')
    }
  }

  private [EMouseKeyBinding.click](event: MouseEvent): void {
    const type = event.type

    if (type in this.keys) {
      event.preventDefault()
      this.keys[type] = true
      devLog('mouse clicked')
    }
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
