import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'

@customElement('keyboard-element')
export class KeyboardElement extends LitElement {
  static styles = css`
    ul {
      position: fixed;
      inset: 0;

      text-shadow: 1px 1px 2px black;
      text-transform: uppercase;
      font-size: 12px;
    }
  `

  protected render(): unknown {
    return html`
      <ul>
        <li>Z: Move Up</li>
        <li>S: Move Down</li>
        <li>D: Move Right</li>
        <li>Q: Move Left</li>
        <li>E: Place conveyor</li>
        <li>F: Debug in console</li>
        <li>F1: Toggle grid</li>
      </ul>
    `
  }
}
