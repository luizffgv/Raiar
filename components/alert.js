import { css, html } from "../internal/tags.js";
import { Component } from "./component.js";

/**
 * A dismissible alert element.
 *
 * @example
 * ```js
 * const alert = new AlertComponent();
 * alert.userDismissible = true;
 * alert.timeout = 3000;
 * alert.content = "This is an alert";
 *
 * document.body.appendChild(alert)
 * ```
 *
 */
export default class Alert extends Component({
  template: html`
    <div id="container">
      <slot id="content"></slot>
      <button id="button-close"></button>
      <div id="color-overlay"></div>
    </div>
  `,
  styles: css`
    #container {
      border-radius: var(--raiar-border-radius);
      box-shadow: var(--raiar-shadow-soft);
      contain: content;
      display: flex;
      gap: 16px;
      justify-content: space-between;
      opacity: 0;
      overflow: hidden;
      padding: var(--raiar-alert-padding);
      position: relative;
      transition: opacity var(--raiar-transition);
      outline: 1px solid
        var(--raiar-this-color, var(--raiar-color-element-border));

      &.visible {
        opacity: 1;
      }
    }

    #content::slotted(*) {
      z-index: 1;
    }

    #button-close {
      cursor: pointer;
      padding: 0;
      border: none;
      background-color: var(--raiar-color-fg);
      mask-image: var(--raiar-svg-close);
      -webkit-mask-image: var(--raiar-svg-close);
      mask-size: cover;
      -webkit-mask-size: cover;
      width: var(--raiar-close-button-size);
      aspect-ratio: 1/1;
      flex-shrink: 0;
      transition: background-color var(--raiar-transition);

      &:hover {
        background-color: var(--raiar-color-danger);
      }
    }

    #color-overlay {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: var(--raiar-this-color);
      opacity: 0.1;
      pointer-events: none;
    }
  `,
}) {
  get #buttonClose() {
    return /** @type {HTMLElement} */ (
      this.shadowRoot.getElementById("button-close")
    );
  }

  get #container() {
    return /** @type {HTMLElement} */ (
      this.shadowRoot.getElementById("container")
    );
  }

  /**
   * Whether the alert was dismissed.
   *
   * @internal
   */
  #dismissed = false;

  /**
   * Content of the warning, either as text or an element. If set to an element,
   * the component takes ownership of it.
   *
   * @param {string | HTMLElement} content
   */
  set content(content) {
    if (content instanceof HTMLElement) {
      this.replaceChildren(content);
    } else {
      const slotted = document.createElement("p");
      slotted.textContent = content;
      this.replaceChildren(slotted);
    }
  }

  /**
   * Timer until the alert disappears.
   *
   * @param {number} duration Timeout duration in ms.
   */
  set timeout(duration) {
    setTimeout(() => {
      this.dismiss();
    }, duration);
  }

  /**
   * Whether the user can manually dismiss the alert.
   *
   * @param {boolean} dismissible Whether the user can manually dismiss the
   * alert.
   */
  set userDismissible(dismissible) {
    this.#buttonClose.style.display = dismissible ? "block" : "none";
  }

  /** Whether the user can manually dismiss the alert. */
  get userDismissible() {
    return this.#buttonClose.style.display == "block";
  }

  constructor() {
    super();

    this.#buttonClose.addEventListener("click", () => {
      this.dismiss();
    });
  }

  connectedCallback() {
    // Short timeout so the element starts invisible then fades in.
    setTimeout(() => {
      this.#container.classList.add("visible");
    }, 0);
    this.setAttribute("role", "alert");
  }

  /**
   * Dismisses the alert, removing it.
   *
   * @remarks
   * The alert is not instantly removed, it fades out.
   */
  dismiss() {
    if (this.#dismissed) return;

    this.#container.addEventListener("transitionend", () => {
      this.remove();
    });
    this.#container.classList.remove("visible");
  }
}

customElements.define("raiar-alert", Alert);
