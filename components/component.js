/**
 * @typedef {Object} ComponentParameters
 * @property {string} [styles] String containing the contents of the style sheet
 *           for the element to use.
 * @property {string} [template] String containing the initial HTML contents of
 *           the element's shadow DOM.
 * @property {boolean} [imperativeSlotting] Whether slots will be imperatively
 *           or declaratively assigned.
 */

/**
 * Creates a class for a component to extend.
 *
 * @param {ComponentParameters} parameters Class creation parameters.
 */
export function Component(parameters) {
  return class Component extends HTMLElement {
    /** @type {CSSStyleSheet} */
    static #styles;
    static {
      this.#styles = new CSSStyleSheet();
      this.#styles.replaceSync(parameters.styles ?? "");
    }

    /** @type {string} */
    static #template = parameters.template ?? "";

    /**
     * @type {ShadowRoot}
     * @override
     */
    shadowRoot;

    constructor() {
      super();

      this.shadowRoot = this.attachShadow({
        mode: "open",
        slotAssignment: parameters.imperativeSlotting ? "manual" : "named",
      });
      this.shadowRoot.innerHTML = Component.#template;
      this.shadowRoot.adoptedStyleSheets.push(Component.#styles);
    }
  };
}

/**
 * Sets the value for an element's attribute or removes that attribute if the
 * {@link value} is `null`.
 *
 * @param {HTMLElement} element Element to modify.
 * @param {string} name Name of the attribute to modify.
 * @param {string?} value New value of the attribute, or `null` for attribute
 * removal.
 */
export function setAttribute(element, name, value) {
  if (value == null) element.removeAttribute(name);
  else element.setAttribute(name, value);
}
