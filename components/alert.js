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
      position: relative;
      z-index: 1;
    }

    #button-close {
      cursor: pointer;
      padding: 0;
      border: none;
      background-color: var(--raiar-color-fg);
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' height='15' viewBox='0 0 15 15' width='15'%3E%3Cg clip-rule='evenodd' fill='%23151515' fill-rule='evenodd'%3E%3Cpath d='m6.79289 7.5-3.14644-3.14645.7071-.7071 3.14645 3.14644 3.1464-3.14644.7072.7071-3.14649 3.14645 3.14649 3.1464-.7072.7072-3.1464-3.14649-3.14645 3.14649-.7071-.7072z'/%3E%3Cpath d='m3.64645 3.64645c.19526-.19527.51184-.19527.7071 0l3.14645 3.14644 3.1464-3.14644c.1953-.19527.5119-.19527.7072 0 .1952.19526.1952.51184 0 .7071l-3.14649 3.14645 3.14649 3.1464c.1952.1953.1952.5119 0 .7072-.1953.1952-.5119.1952-.7072 0l-3.1464-3.14649-3.14645 3.14649c-.19526.1952-.51184.1952-.7071 0-.19527-.1953-.19527-.5119 0-.7072l3.14644-3.1464-3.14644-3.14645c-.19527-.19526-.19527-.51184 0-.7071z'/%3E%3C/g%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' height='15' viewBox='0 0 15 15' width='15'%3E%3Cg clip-rule='evenodd' fill='%23151515' fill-rule='evenodd'%3E%3Cpath d='m6.79289 7.5-3.14644-3.14645.7071-.7071 3.14645 3.14644 3.1464-3.14644.7072.7071-3.14649 3.14645 3.14649 3.1464-.7072.7072-3.1464-3.14649-3.14645 3.14649-.7071-.7072z'/%3E%3Cpath d='m3.64645 3.64645c.19526-.19527.51184-.19527.7071 0l3.14645 3.14644 3.1464-3.14644c.1953-.19527.5119-.19527.7072 0 .1952.19526.1952.51184 0 .7071l-3.14649 3.14645 3.14649 3.1464c.1952.1953.1952.5119 0 .7072-.1953.1952-.5119.1952-.7072 0l-3.1464-3.14649-3.14645 3.14649c-.19526.1952-.51184.1952-.7071 0-.19527-.1953-.19527-.5119 0-.7072l3.14644-3.1464-3.14644-3.14645c-.19527-.19526-.19527-.51184 0-.7071z'/%3E%3C/g%3E%3C/svg%3E");
      mask-size: cover;
      -webkit-mask-size: cover;
      width: 16px;
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
