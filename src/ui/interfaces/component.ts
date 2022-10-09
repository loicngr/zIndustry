export interface IUiComponent {
  readonly _shadowDOM: ShadowRoot

  buildStyles(): string

  // browser calls this method when the element is added to the document
  // (can be called many times if an element is repeatedly added/removed)
  connectedCallback(): void

  // browser calls this method when the element is removed from the document
  // (can be called many times if an element is repeatedly added/removed)
  disconnectedCallback(): void

  // called when the element is moved to a new document
  // (happens in document.adoptNode, very rarely used)
  adoptedCallback(): void

  // called when one of attributes listed above is modified
  attributeChangedCallback(): void
}
