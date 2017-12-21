var input = (function () {
'use strict';

window.addEventListener('load',function(){new input()});

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

function Input(options) {
  Atom.call(this, options);

  const defaults = {
    selector: 'input[type="text"]',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);
}

Input.prototype = Object.create(Atom.prototype);
Input.prototype.constructor = Input;

return Input;

}());
//# sourceMappingURL=input.js.map
