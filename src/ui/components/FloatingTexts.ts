import { customElement, property } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import type { TemplateResult } from 'lit'
import { map } from 'lit/directives/map.js'
import { TFloatingText } from '../../common/types'

@customElement('floating-texts-element')
export class FloatingTexts extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    #floatingScreen {
      width: 100vw;
      height: 100vh;

      position: fixed;
      pointer-events: none;
    }

    #floatingScreen span {
      position: absolute;
    }
  `

  @property({ type: Object })
  floatingTexts: TFloatingText[] | undefined

  private get floatingTextsTemplate(): TemplateResult {
    if (!this.floatingTexts) {
      return html``
    }

    return html`<div id="floatingScreen">
      ${map(
        this.floatingTexts,
        (item) => html` <span style="left: ${item.at.x}px; top: ${item.at.y}px">${item.text}</span> `,
      )}
    </div>`
  }

  protected render(): unknown {
    return html`${this.floatingTextsTemplate}`
  }
}
