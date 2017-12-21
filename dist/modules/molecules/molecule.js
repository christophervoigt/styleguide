var molecule = (function () {
'use strict';

window.addEventListener('load',function(){new molecule()});

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

function Molecule(options) {
  Atom.call(this, options);

  const defaults = {
    selector: 'body',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);
}

Molecule.prototype = Object.create(Atom.prototype);
Molecule.prototype.constructor = Molecule;

Molecule.prototype.notify = function notify(module, eventType) {
  const self = this;
  const { selector } = self.options;

  console.info(selector, 'got', eventType, 'Event from', module.options.selector);
};

return Molecule;

}());
//# sourceMappingURL=molecule.js.map
