import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { goTo as routerGoTo } from '../../router'
import { ROUTER_DEFAULT } from '../../common/consts'

@customElement('not-found-element')
export class NotFoundElement extends LitElement {
  static styles = css`
    h1 {
      color: white;
    }
  `

  protected render(): unknown {
    return html`<h1>not found</h1>
      <a href="${routerGoTo(ROUTER_DEFAULT)}">Go home</a>`
  }
}
