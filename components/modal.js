import { CSSDurationToMs } from "../internal/conversions.js";
import { css, html } from "../internal/tags.js";
import { Component } from "./component.js";

/**
 * A modal window.
 *
 * @remarks
 * To insert content into the modal, add the content as children. You can also
 * directly set the modal's `innerHTML`.
 *
 * @example
 * const modal = new Modal();
 * modal.innerHTML = `
 *   <h2>Account created</h2>
 *   You can now like artwork and publish your own.
 *   <button class="raiar-color-primary">View my profile</button>
 * `
 * modal.userDismissible = true;
 * document.body.appendChild(modal);
 */
export default class Modal extends Component({
  template: html`
    <div id="container">
      <div id="card" role="dialog" aria-modal="true">
        <slot id="slot"></slot>
        <div id="button-close"></div>
      </div>
    </div>
  `,

  styles: css`
    #container {
      align-items: center;
      backdrop-filter: blur(35px);
      background-color: #0009;
      box-sizing: border-box;
      display: flex;
      height: 100vh;
      justify-content: center;
      left: 0;
      padding: 16px;
      position: fixed;
      top: 0;
      width: 100vw;
    }

    #card {
      align-items: start;
      background-color: var(--raiar-color-bg-close);
      border-radius: var(--raiar-border-radius);
      box-shadow: var(--raiar-shadow);
      box-sizing: border-box;
      display: flex;
      max-height: 100%;
      overflow-y: auto;
      padding: var(--raiar-card-padding);
    }

    #slot {
      display: flex;
      flex-direction: column;
      gap: var(--raiar-gap);
    }

    #button-close {
      -webkit-mask-image: var(--raiar-svg-close);
      -webkit-mask-size: cover;
      aspect-ratio: 1/1;
      background-color: var(--raiar-color-fg);
      content: "";
      cursor: pointer;
      flex-shrink: 0;
      mask-image: var(--raiar-svg-close);
      mask-size: cover;
      transition: background-color var(--raiar-transition);
      width: var(--raiar-close-button-size);

      &:hover {
        background-color: var(--raiar-color-danger);
      }
    }
  `,
}) {
  #appearAnimation;

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
   * Whether the user can manually dismiss the modal window using the close
   * button.
   *
   * @param {boolean} dismissible Whether the user can manually dismiss the
   * modal window using the close button.
   */
  set userDismissible(dismissible) {
    this.#buttonClose.style.display = dismissible ? "block" : "none";
  }

  /** Whether the user can manually dismiss the modal window. */
  get userDismissible() {
    return this.#buttonClose.style.display != "none";
  }

  constructor() {
    super();

    this.#buttonClose.addEventListener("click", () => {
      this.dismiss();
    });

    const bodyStyle = getComputedStyle(document.body);

    this.#appearAnimation = new Animation(
      new KeyframeEffect(
        this.#container,
        [
          {
            opacity: "0",
          },
          {
            opacity: "1",
          },
        ],
        {
          duration: CSSDurationToMs(
            bodyStyle.getPropertyValue("--raiar-transition-duration")
          ),
          easing: bodyStyle.getPropertyValue("--raiar-transition-easing"),
        }
      )
    );
  }

  connectedCallback() {
    this.#appearAnimation.play();
  }

  /** Dismisses the modal, removing it from the DOM tree. */
  dismiss() {
    this.#appearAnimation.reverse();
    this.#appearAnimation.addEventListener("finish", () => {
      this.remove();
    });
  }
}

customElements.define("raiar-modal", Modal);
