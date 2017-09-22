
import Atom from '../atom';

export default function Input(options) {
  Atom.call(this, options);

  const defaults = {
    selector: 'input[type="text"]',
    scope: document,
  };

  this.options = Object.assign({}, defaults, options);
}

Input.prototype = Object.create(Atom.prototype);
Input.prototype.constructor = Input;
