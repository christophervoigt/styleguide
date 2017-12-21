var button = (function () {
'use strict';

window.addEventListener('load',function(){new button()});

function Atom(options) {
  const defaults = {
    selector: 'body',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);
}

Atom.prototype.subscribe = function subscribe(eventType, parent) {
  const self = this;
  const { scope, selector } = self.options;

  const nodes = scope.querySelectorAll(selector);

  nodes.forEach((node) => {
    node.addEventListener(eventType, (event) => {
      event.stopPropagation();
      parent.notify(self, event.type);
    }, true);
  });
};

function Button(options) {
  Atom.call(this, options);

  const defaults = {
    selector: '.button',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);
}

Button.prototype = Object.create(Atom.prototype);
Button.prototype.constructor = Button;

return Button;

}());
//# sourceMappingURL=button.js.map
