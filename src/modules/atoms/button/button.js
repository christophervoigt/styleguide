import Atom from '../atom';

export default function Button(options) {
  Atom.call(this, options);

  const defaults = {
    selector: '.button',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);
}

Button.prototype = Object.create(Atom.prototype);
Button.prototype.constructor = Button;
