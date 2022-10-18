import { customElement, property } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { goTo as routerGoTo } from '../../router'
import { ROUTER_DEFAULT } from '../../common/consts'

@customElement('pause-element')
export class PauseElement extends LitElement {
  static styles = css`
    #pause {
      width: 100vw;
      height: 100vh;

      position: fixed;
      inset: 0;

      background-color: rgba(192, 192, 192, 0.5);
      z-index: 3;

      display: flex;
      flex-direction: column;

      justify-content: center;
      align-items: center;
    }

    #pause h1,
    #pause a {
      text-transform: uppercase;
      font-weight: bold;
      color: white;
    }
  `
  @property({ type: Object })
  isGamePaused: boolean = false

  protected render(): unknown {
    return !this.isGamePaused
      ? html``
      : html`<div id="pause">
          <h1>Menu</h1>
          <a href="${routerGoTo(ROUTER_DEFAULT)}">Go home</a>
          <a href="https://github.com/loicngr/zindustry" target="_blank">Github</a>
        </div>`
  }
}
