
import Atom from '../atoms/atom';

export default function Molecule(options) {
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
