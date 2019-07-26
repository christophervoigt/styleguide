var bundle = (function () {
  'use strict';

  document.addEventListener('DOMContentLoaded',function(){bundle()});

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

  function Searchbar() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.searchbar';
    var callbacks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var element = document.querySelector(selector);

    if (element) {
      // ermöglicht das Erweitern der Funktionalität
      var keys = Object.keys(callbacks);
      keys.forEach(function (key) {
        element.addEventListener(key, callbacks[key]);
      });
    }

    var button = document.querySelector('.searchbar .button');

    if (button) {
      button.addEventListener('click', function () {
        console.log('searchbar:', 'you clicked my button');
      });
    }

    var input = document.querySelector('.searchbar input');

    if (input) {
      input.addEventListener('change', function () {
        console.log('searchbar:', 'you changed my input');
      });
    } // Atome können ebenfalls als Objekt initialisiert werden, wenn
    // interne Logik vorhanden ist (bspw. video-player)


    return this;
  }

  function Header() {
    Searchbar('.header_searchbar', {
      mouseover: function mouseover() {
        console.log('header:', 'you hovered over my searchbar');
      }
    }); // alternativ:
    // new Searchbar();
    // new Searchbar('header .searchbar');
    // -> Logik der Searchbar selbst wird immer ausgeführt
    // -> Callbacks ermöglichen das Erweitern der Funktionalität
  }

  function bundle() {
    base();
    Header();
  }

  return bundle;

}());
