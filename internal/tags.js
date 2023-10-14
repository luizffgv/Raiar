/**
 * No-op tag function to mark a string as HTML code.
 *
 * Some IDEs and extensions will properly format and highlight code inside this
 * tag.
 *
 * @param {TemplateStringsArray} strings
 * @param  {unknown[]} vals
 * @returns {string}
 */
export function html(strings, ...vals) {
  const valStrings = vals.map(String);
  // valStrings count could be one less than strings count, so we add a dummy
  // string
  valStrings.push("");

  return strings
    .map((string, index) => string + valStrings[index])
    .reduce((prev, cur) => prev + cur);
}

/**
 * No-op tag function to mark a string as a CSS style sheet.
 *
 * Some IDEs and extensions will properly format and highlight code inside this
 * tag.
 *
 * @param {TemplateStringsArray} strings
 * @param  {unknown[]} vals
 * @returns {string}
 */
export function css(strings, ...vals) {
  return html(strings, ...vals);
}
