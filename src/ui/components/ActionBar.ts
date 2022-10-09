import { customElement, property } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { TActionBar } from '../../game/types/actionBar'
import { map } from 'lit/directives/map.js'

@customElement('action-bar-element')
export class ActionBar extends LitElement {
  static styles = css`
    #actionBar {
      width: 100vw;
      height: 50px;

      position: fixed;
      bottom: 5px;
    }

    .hud {
      width: auto;
      height: 50px;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hud .item {
      width: 50px;
      height: 50px;

      background-color: white;
      color: black;
      text-align: center;
      line-height: 50px;

      margin: 0 5px;
    }
  `

  @property({ type: Object })
  actionBar: TActionBar | undefined

  protected render(): unknown {
    return html`<div id="actionBar">
      <div class="hud">${map(this.actionBar?.items, (i) => html`<div class="item">${i.name}</div>`)}</div>
    </div>`
  }
}
