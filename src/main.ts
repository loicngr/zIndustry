import './style.css'
import {Game} from "./Game"
import {APP_MAP_SIZE} from "./consts"

window.onload = () => {
    const canvas = document.createElement('canvas')

    const _APP_MAP_SIZE = APP_MAP_SIZE()

    canvas.width = _APP_MAP_SIZE.width
    canvas.height = _APP_MAP_SIZE.height

    const context = canvas.getContext('2d')
    if (!context) {
        return
    }

    document.body.insertBefore(canvas, document.body.childNodes[0])

    const game = new Game(context)
    game.run()
}