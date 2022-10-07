import './style.css'
import {GameElement} from "./components/GameElement"
import {KeyboardElement} from "./components/KeyboardElement";

window.onload = () => {
    customElements.define('game-element', GameElement)
    customElements.define('keyboard-element', KeyboardElement)
}