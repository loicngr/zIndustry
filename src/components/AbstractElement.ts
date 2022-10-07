import {IUiComponent} from "../interfaces";

export abstract class AbstractElement extends HTMLElement implements IUiComponent {
  static get observedAttributes(): string[] {
    return []
  }

  readonly _shadowDOM: ShadowRoot;

  protected constructor() {
    super()

    this._shadowDOM = this.attachShadow({ mode: 'open'})
  }

  adoptedCallback(): void {
    console.log('Custom element moved to new page.')
  }

  attributeChangedCallback(): void {
  }

  buildStyles(): string {
    return "";
  }

  connectedCallback(): void {
    console.log('Custom element added to page.')
  }

  disconnectedCallback(): void {
    console.log('Custom element removed from page.')
  }
}