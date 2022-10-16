import { customElement } from 'lit/decorators.js'
import { css, html, LitElement } from 'lit'
import type { PropertyValues } from 'lit'
import { bind as routerBind } from '../router'
import { createRef, ref } from 'lit/directives/ref.js'
import type { Ref } from 'lit/directives/ref.js'

@customElement('app-element')
export class AppElement extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
    }

    header {
    }

    main {
      height: 100vh;
      width: 100vw;

      display: flex;
      justify-content: center;
      align-items: center;
    }

    footer {
    }
  `

  private readonly mainRef: Ref<HTMLCanvasElement> = createRef()

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties)

    const mainRef: HTMLCanvasElement | undefined = this.mainRef.value

    if (!mainRef) {
      throw new Error('Main element not found')
    }

    routerBind(mainRef)
  }

  protected render(): unknown {
    return html`<header></header>
      <main ${ref(this.mainRef)} role="main"></main>
      <footer></footer>`
  }
}
