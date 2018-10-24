/* eslint-disable no-param-reassign,no-unused-vars */

/**
 * Check if DOM element is inside of viewport.
 * Returns 'false' if element is only partially inside viewport.
 * @param element
 * @returns {boolean}
 */
function isInViewport(element) {
  const bounding = element.getBoundingClientRect();

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Check if DOM element is outside viewport.
 * Returns 'false' if element is only partially outside viewport.
 * @param element
 */
function isOutOfViewport(element) {
  const bounding = element.getBoundingClientRect();
  const out = {};

  out.top = bounding.top < 0;
  out.left = bounding.left < 0;
  out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
  out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
  out.any = out.top || out.left || out.bottom || out.right;
  out.all = out.top && out.left && out.bottom && out.right;
  return out;
}

/**
 * Force vieport redraw to fix e.g. outside of viewport positioned html-tag.
 * @param element
 */
function forceViewportRedraw(element) {
  const { display } = element.style;
  element.style.display = 'none';
  const trick = element.offsetHeight;
  element.style.display = display;
}

export { isInViewport, isOutOfViewport, forceViewportRedraw };
