import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'

@customElement('keyboard-element')
export class KeyboardElement extends LitElement {
  static styles = css`
    @counter-style clear {
      system: cyclic;
      symbols: '|';
      suffix: '-';
    }

    ul {
      position: fixed;
      inset: 0;

      text-shadow: 1px 1px 2px black;
      text-transform: uppercase;
      font-size: 12px;
    }

    .clear {
      list-style: clear;
    }
  `

  protected render(): unknown {
    return html`
      <ul>
        <li>Z: Move Up</li>
        <li>S: Move Down</li>
        <li>D: Move Right</li>
        <li>Q: Move Left</li>
        <li class="clear"></li>
        <li>Escape: Pause game</li>
        <li>E: Place selected item</li>
        <li>F: Debug in console</li>
        <li>F1: Toggle grid</li>
      </ul>
    `
  }
}
