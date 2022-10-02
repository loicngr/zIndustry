import './style.css'
import {Game} from "./Game"

window.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512

    const context = canvas.getContext('2d')
    if (!context) {
        return
    }

    document.body.insertBefore(canvas, document.body.childNodes[0])

    const game = new Game(context)
    game.run()
}