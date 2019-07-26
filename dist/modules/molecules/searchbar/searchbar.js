var searchbar = (function () {
  'use strict';

  document.addEventListener('DOMContentLoaded',function(){searchbar()});

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

  return Searchbar;

}());
