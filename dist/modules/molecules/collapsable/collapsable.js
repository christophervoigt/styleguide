var collapsable = (function () {
  'use strict';

  document.addEventListener('DOMContentLoaded',function(){collapsable()});

  function collapsable() {
    var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-collapse]';
    var elements = document.querySelectorAll(selector);

    if (elements.length) {
      Array.prototype.forEach.call(elements, function (element) {
        element.addEventListener('click', function () {
          var parent = element.parentNode;
          var targetSelector = element.dataset.collapse;
          var target = parent.querySelector(targetSelector);

          if (!target.classList.contains('expanded')) {
            target.style.cssText = 'height: auto';
            var height = target.scrollHeight;
            target.style.cssText = 'height: 0';
            target.style.cssText = "max-height: ".concat(height, "px;");
          } else {
            target.style.cssText = '';
          }

          element.classList.toggle('expanded');
          target.classList.toggle('expanded');
        });
      });
    }
  }

  return collapsable;

}());
