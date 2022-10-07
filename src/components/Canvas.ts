import {AbstractBasic} from "./AbstractBasic"
import {Game} from "../Game"
import {APP_MAP_SIZE} from "../consts";

export class Canvas extends AbstractBasic {
  constructor() {
    super()

    this._shadowDOM.innerHTML = `
        ${this.buildStyles()}
        <canvas></canvas>
    `

    const canvas: HTMLCanvasElement = this._shadowDOM.querySelector('canvas')!
    const context: CanvasRenderingContext2D = canvas.getContext('2d')!

    const _APP_MAP_SIZE = APP_MAP_SIZE()

    canvas.width = _APP_MAP_SIZE.width
    canvas.height = _APP_MAP_SIZE.height

    const game = new Game(context)
    game.run()
  }

  buildStyles(): string {
    return `<style> :root{ overflow: hidden } </style>`
  }
}