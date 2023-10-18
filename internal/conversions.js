/**
 * Converts a CSS duration to a number representing that duration in ms.
 *
 * @param {string} duration CSS duration.
 *
 * @example
 * CSSDurationToMs("2s"); // Returns 2000
 * CSSDurationToMs("2ms"); // Returns 2
 */
export function CSSDurationToMs(duration) {
  let raw = Number.parseFloat(duration);

  if (!duration.includes("m")) raw *= 1000;

  return raw;
}
