import { css, html } from "../../internal/tags.js";
import { Component } from "../component.js";

/**
 * A button with an X icon.
 *
 * @remarks
 * Should close or remove something on click.
 *
 * Attributes:
 * - Optional:
 *   - `aria-label` (text): ARIA label forwarded to the button.
 */
export default class CloseButton extends Component({
  template: html`<button id="button" type="button"></button> `,
  styles: css`
    :host {
      display: contents;
    }

    #button {
      aspect-ratio: 1/1;
      background: transparent;
      border: none;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0;
      position: relative;
      width: var(--raiar-close-button-size);

      &:hover::after {
        background-color: var(--raiar-color-danger);
      }

      &::after {
        -webkit-mask-image: var(--raiar-svg-close);
        -webkit-mask-size: cover;
        background-color: var(--raiar-color-fg);
        content: "";
        inset: 0;
        mask-image: var(--raiar-svg-close);
        mask-size: cover;
        position: absolute;
        transition: background-color var(--raiar-transition);
      }
    }
  `,
}) {
  static observedAttributes = /** @type {const} */ (["aria-label"]);

  /** @type {{[key in typeof CloseButton.observedAttributes[number]]: (this: CloseButton, value: string | null) => void}} */
  static #handlers = {
    "aria-label": function (value) {
      this.#button.ariaLabel = value;
    },
  };

  get #button() {
    return /** @type {HTMLButtonElement} */ (
      this.shadowRoot.getElementById("button")
    );
  }

  /**
   * @internal
   * @param {CloseButton.observedAttributes[number]} name
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    CloseButton.#handlers[name]?.bind(this)(newValue);
  }
}

customElements.define("raiar-internal-close-button", CloseButton);
