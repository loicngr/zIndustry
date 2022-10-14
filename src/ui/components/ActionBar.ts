import { customElement, property } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import { TActionBar } from '../../game/types/actionBar'
import { map } from 'lit/directives/map.js'
import { range } from 'lit/directives/range.js'
import { EFormatKey } from '../../game/enums/key'

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
      bottom: 10px;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    #actionBar .item {
      width: 50px;
      height: 50px;

      background-color: rgba(255, 255, 255, 0.51);
      color: black;
      text-align: center;
      line-height: 50px;
      border: 1px solid rgba(0, 0, 0, 0.43);
      border-radius: 5px;

      margin: 0 5px;
      font-size: 10px;

      position: relative;
    }

    #actionBar .item.selected {
      border: 1px solid black;
    }

    #actionBar .item .itemName {
    }
    #actionBar .item .itemKey {
      width: 10px;
      height: 10px;

      position: absolute;
      top: -2.5px;
      left: -2.5px;

      line-height: initial;
      font-weight: bold;

      background: silver;

      font-size: 9px;
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

  protected get getSelected(): number | undefined {
    return this.actionBar?.selected
  }

  protected render(): unknown {
    const actionBar = this.actionBar

    if (!actionBar) {
      return
    }

    return html`<div id="actionBar">
      ${map(
        range(actionBar.size),
        (i) =>
          html`${actionBar?.items[i]
            ? html`
                <div class="item ${this.getSelected === actionBar?.items[i].id ? 'selected' : ''}">
                  <span class="itemKey">${EFormatKey[actionBar?.items[i].key]}</span>
                  <span class="itemCount">${actionBar?.items[i].count}</span>
                  <span class="itemName">${actionBar?.items[i].name}</span>
                </div>
              `
            : html`<div class="item"></div>`}`,
      )}
    </div>`
  }
}
