/// <reference types="vite/client" />

import {KeyboardElement} from "./components/KeyboardElement"
import {GameElement} from "./components/GameElement"
import {CanvasElement} from "./components/CanvasElement"

declare global {
    interface HTMLElementTagNameMap {
        "game-element": GameElement
        "keyboard-element": KeyboardElement
        "canvas-element": CanvasElement
    }
}
