import { css, html } from "../internal/tags.js";
import { Component, setAttribute } from "./component.js";

const RANGE_THUMB_STYLE = css`
  --track-fill-size: 999999px; /* calc(infinity * 1px) doesn't work here */
  --raiar-color: var(--raiar-this-color, var(--raiar-color-primary));

  width: 16px;
  height: 16px;
  transition: border var(--raiar-transition);
  border: 2px solid var(--raiar-color);
  box-shadow: calc(0px - var(--track-fill-size)) 0 0
    calc(var(--track-fill-size) - 8px) var(--raiar-color);
  appearance: none;
  background-color: var(--raiar-color-slider-thumb);
  border-radius: calc(infinity * 1px);
  box-sizing: border-box;
`;

const RANGE_THUMB_STYLE_ACTIVE = css`
  border-width: 4px;
`;

/**
 * A range slider element.
 *
 * @remarks
 *
 * Attributes:
 * - Required
 *   - `data-label` (text): A label for the slider.
 *   - `data-min` (number): Minimum value of the slider.
 *   - `data-max` (number): Maximum value of the slider.
 * - Optional:
 *   - `data-step` (number): The increment/decrement step between each slider
 *      position.
 *   - `data-assoc` (JSON): Object containing mappings between internal slider
 *     values and displayed values. Can be combined with `data-suffix`.
 *
 *     ```html
 *     <raiar-slider
 *       data-label="Shirt size"
 *       data-min="1" data-max="3"
 *       data-assoc='{"1": "small", "2": "medium", "3": "large"}'
 *     ></raiar-slider>
 *     ```
 *
 *     When the internal slider value is not present as a key in the association
 *     map, the internal value will be displayed.
 *   - `data-suffix` (text): Suffix applied to the displayed value. Can be
 *     combined with `data-assoc`.
 *
 *     ```html
 *     <!-- This slider's display value goes from "2 players" to "4 players" -->
 *     <raiar-slider
 *       data-label="Room size"
 *       data-min="2" data-max="4"
 *       data-suffix=" players"
 *     ></raiar-slider>
 *     ```
 */
export default class Slider extends Component({
  template: html`<div id="container">
    <label id="label" for="slider"></label>
    <span id="value"></span>
    <input id="slider" part="slider" type="range" />
  </div> `,

  styles: css`
    :host {
      width: 100%;
    }

    #container {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: space-between;
    }

    #slider {
      height: 16px;
      width: 100%;
      background-color: var(--raiar-color-slider-bg);
      border-radius: calc(infinity * 1px);
      appearance: none;
      overflow: hidden;
      touch-action: pinch-zoom;

      &:hover {
        cursor: pointer;
      }
    }

    /* The following selectors can't be nested because Chromium has a bug
         where an invalid nested pseudo-element selector also invalidates other
         valid pseudo-element selectors in the same parent selector. */
    #slider::-moz-range-thumb {
      ${RANGE_THUMB_STYLE}
    }
    #slider::-webkit-slider-thumb {
      ${RANGE_THUMB_STYLE}
    }
    #slider:active::-moz-range-thumb {
      ${RANGE_THUMB_STYLE_ACTIVE}
    }
    #slider:active::-webkit-slider-thumb {
      ${RANGE_THUMB_STYLE_ACTIVE}
    }
  `,
}) {
  static formAssociated = true;

  /** @type {{[key in typeof Slider.observedAttributes[number]]: (this: Slider, value: string | null) => void}} */
  static #handlers = {
    "data-min": function (value) {
      setAttribute(this.#slider, "min", value);
      this.#updateValue();
    },
    "data-max": function (value) {
      setAttribute(this.#slider, "max", value);
      this.#updateValue();
    },
    "data-value": function (value) {
      setAttribute(this.#slider, "value", value);
      this.#updateValue();
    },
    "data-step": function (value) {
      setAttribute(this.#slider, "step", value);
      this.#updateValue();
    },
    "data-label": function (value) {
      this.#label.textContent = value;
    },
    "data-assoc": function () {
      this.#updateAssociations();
    },
    "data-suffix": function (value) {
      this.#suffix = value ?? "";
      this.#updateValue();
    },
  };

  static observedAttributes = /** @type {const} */ ([
    "data-min",
    "data-max",
    "data-value",
    "data-step",
    "data-label",
    "data-assoc",
    "data-suffix",
  ]);

  /** @type {ElementInternals} */
  #internals;

  /** @type {{[index: string]: string}?} */
  #associations = null;

  #suffix = "";

  constructor() {
    super();

    this.#internals = this.attachInternals();

    this.#updateAssociations();

    this.#slider.addEventListener("input", () => {
      this.#updateValue();
    });
  }

  get #label() {
    return /** @type {HTMLLabelElement} */ (
      this.shadowRoot.getElementById("label")
    );
  }

  get #valueElement() {
    return /** @type {HTMLElement} */ (this.shadowRoot.getElementById("value"));
  }

  get #slider() {
    return /** @type {HTMLInputElement} */ (
      this.shadowRoot.getElementById("slider")
    );
  }

  /** The current value of the slider. */
  get value() {
    return this.#slider.value;
  }

  /**
   * Updates the displayed value and form value with the slider value.
   *
   * @remarks
   * The form value is the raw value, ignoring `data-assoc`.
   */
  #updateValue() {
    const rawValue = this.#slider.value;

    let newValue;
    newValue = this.#associations?.[this.#slider.value] ?? rawValue;

    this.#internals.setFormValue(rawValue);

    this.#valueElement.textContent = newValue + this.#suffix;
    this.#slider.ariaValueText = this.#valueElement.textContent;
  }

  /**
   * Updates the slider's association map.
   */
  #updateAssociations() {
    const rawAssociations = this.dataset["assoc"];

    if (rawAssociations != null) {
      const associations = JSON.parse(rawAssociations);
      if (!(typeof associations == "object"))
        throw new Error(
          "data-assoc attribute in raiar-slider is not a proper JSON object."
        );
      this.#associations = associations;
    }

    this.#updateValue();
  }

  /**
   * @internal
   * @param {Slider.observedAttributes[number]} name
   * @param {string} _oldValue
   * @param {string} newValue
   */
  attributeChangedCallback(name, _oldValue, newValue) {
    Slider.#handlers[name]?.bind(this)(newValue);
  }
}

customElements.define("raiar-slider", Slider);
