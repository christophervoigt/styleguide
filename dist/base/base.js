var base = (function () {
  'use strict';

  document.addEventListener('DOMContentLoaded',function(){base()});

  function lazyImages() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'img[data-src]';
    checkElements(selector);
    var observer = new MutationObserver(function () {
      checkElements(selector);
    });
    observer.observe(document.body, {
      childList: true
    });
  }

  function load(element) {
    var src = element.dataset.src;
    element.removeAttribute('data-src');
    element.setAttribute('src', src);
  }

  function checkElements(selector) {
    var elements = document.querySelectorAll(selector);

    if (elements.length) {
      Array.prototype.forEach.call(elements, function (element) {
        load(element);
      });
    }
  }

  function base() {
    lazyImages();
  }

  return base;

}());
