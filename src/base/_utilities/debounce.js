/* eslint-disable func-names */
/**
 * Debounce functions for better performance
 * https://davidwalsh.name/javascript-debounce-function
 * @param {Function} func The function to debounce
 * @param {Integer} wait Amount of delay to wait for
 * @param {Boolean} immediate trigger function immediately
 * @param args additional arguments
 * @returns {Function}
 */
export default function debounce(func, wait, immediate = false, ...args) {
  let timeout;

  return function () {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
