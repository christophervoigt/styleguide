var searchbar = (function () {
'use strict';

window.addEventListener('load',function(){new searchbar()});

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

function Searchbar(options) {
  Molecule.call(this, options);

  const defaults = {
    selector: '.searchbar',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);

  this.childScope = this.options.scope.querySelector(this.options.selector);

  this.searchbarButton = new Button({
    selector: '.searchbar-button',
    scope: this.childScope,
  });
  this.searchbarButton.subscribe('click', this);

  this.searchbarInput = new Input({
    selector: '.searchbar-input',
    scope: this.childScope,
  });
  this.searchbarInput.subscribe('change', this);
}

Searchbar.prototype = Object.create(Molecule.prototype);
Searchbar.prototype.constructor = Searchbar;

// TODO: implement custom notify function

return Searchbar;

}());
//# sourceMappingURL=searchbar.js.map
