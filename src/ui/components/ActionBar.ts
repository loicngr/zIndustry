import { customElement, property } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { TActionBar } from '../../game/types/actionBar'
import { map } from 'lit/directives/map.js'

@customElement('action-bar-element')
export class ActionBar extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
    }

    #actionBar {
      width: 100vw;
      height: 50px;

      position: fixed;
      bottom: 5px;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    #actionBar .item {
      width: 50px;
      height: 50px;

      background-color: white;
      color: black;
      text-align: center;
      line-height: 50px;

      margin: 0 5px;
      font-size: 10px;

      position: relative;
    }

    #actionBar .item.selected {
      border: 1px solid black;
    }

    #actionBar .item .itemCount {
      width: 15px;
      height: 15px;

      position: absolute;
      bottom: 1px;
      right: 1px;

      line-height: initial;
      font-weight: bold;

      border-radius: 10px;
      background: silver;

      font-size: 12px;
    }
  `

  @property({ type: Object })
  actionBar: TActionBar | undefined

  protected getSelected(): number | undefined {
    return this.actionBar?.selected
  }

  protected render(): unknown {
    const actionBar = this.actionBar

    return html`<div id="actionBar">
      ${map(
        actionBar?.items,
        (i) => html`<div class="item ${actionBar?.selected === i.id ? 'selected' : ''}">
          <span class="itemCount">${i.count}</span>
          ${i.name}
        </div>`,
      )}
    </div>`
  }
}
