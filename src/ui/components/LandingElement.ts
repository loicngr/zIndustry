import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { goTo as routerGoTo } from '../../router'
import { ROUTER_GAME } from '../../common/consts'

@customElement('landing-element')
export class LandingElement extends LitElement {
  static styles = css`
    div {
      text-align: center;
    }

    div a {
      text-decoration: underline;
      font-weight: bold;
      text-transform: uppercase;
      color: white;
      transition: 0.5s;
    }

    div a:hover {
      transition: 0.5s;
      color: rebeccapurple;
    }
  `

  protected render(): unknown {
    return html`<div>
        <h1>Welcome</h1>
        <br />
        <a href="${routerGoTo(ROUTER_GAME)}">Play</a>
    </p>`
  }
}
