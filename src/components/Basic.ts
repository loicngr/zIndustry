import {AbstractBasic} from "./AbstractBasic"

export class Basic extends AbstractBasic {
  constructor() {
    super()

    this._shadowDOM.innerHTML = `
        ${this.buildStyles()}
        <div class="wrapper">
            <ul>
                <li>Z: Move Up</li>
                <li>S: Move Down</li>
                <li>D: Move Right</li>
                <li>Q: Move Left</li>
                <li>E: Place conveyor</li>
                <li>F: Debug in console</li>
                <li>F1: Toggle grid</li>
            </ul>
        </div>
    `
  }

  buildStyles(): string {
    return `<style>
      .wrapper {
        position: fixed;
        inset: 0;

        text-shadow: 1px 1px 2px black;
        text-transform: uppercase;
        font-size: 12px;
      }
    </style>`
  }
}