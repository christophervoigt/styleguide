
export default function lazyImages(selector = 'img[data-src]') {
  checkElements(selector);

  const observer = new MutationObserver(() => {
    checkElements(selector);
  });
  observer.observe(document.body, { childList: true });
}

function load(element) {
  const { src } = element.dataset;
  element.removeAttribute('data-src');
  element.setAttribute('src', src);
}

function checkElements(selector) {
  const elements = document.querySelectorAll(selector);
  if (elements.length) {
    Array.prototype.forEach.call(elements, (element) => {
      load(element);
    });
  }
}
