
import Molecule from '../molecules/molecule.js'


export default function Organism (options) {
    Molecule.call(this, options)

    const defaults = {
        selector: 'body',
        scope: document
    }

    this.options = Object.assign({}, defaults, options)
}

Organism.prototype = Object.create(Molecule.prototype)
Organism.prototype.constructor = Organism
