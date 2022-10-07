import {customElement, property} from "lit/decorators.js"
import {html, LitElement, PropertyValues} from "lit"
import {APP_MAP_SIZE} from "../consts"
import {createRef, ref, Ref} from "lit/directives/ref.js"

@customElement('canvas-element')
export class CanvasElement extends LitElement {

    public canvasRef: Ref<HTMLCanvasElement> = createRef()

    @property()
    currentWindow: Window | undefined

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties)

        const canvasContext: HTMLCanvasElement | undefined = this.canvasRef.value

        this.dispatchEvent(new CustomEvent('update-canvas-context', {
            bubbles: true,
            detail: canvasContext?.getContext('2d')
        }))
    }

    protected render(): unknown {
        const _APP_MAP_SIZE = APP_MAP_SIZE()

        return html`
            <canvas
                    ${ref(this.canvasRef)}
                    width="${_APP_MAP_SIZE.width}"
                    height="${_APP_MAP_SIZE.height}"
            ></canvas>
        `
    }
}