import './style.css'
import {Basic} from "./components/Basic"
import {Canvas} from "./components/Canvas"

window.onload = () => {
    customElements.define('basic-element', Basic)
    customElements.define('canvas-element', Canvas)
}