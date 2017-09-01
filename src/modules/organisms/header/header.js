
import Organism from '../organism.js'

import Searchbar from '../../molecules/searchbar/searchbar.js'


export default function Header (options) {
    Organism.call(this, options)

    const defaults = {
        selector: '.header',
        scope: document
    }

    this.options = Object.assign({}, defaults, options)

    this.childScope = this.options.scope.querySelector(this.options.selector)


    this.headerSearchbar = new Searchbar({
        selector: '.header-searchbar',
        scope:  this.childScope
    })
    this.headerSearchbar.subscribe('search', this)
}

Header.prototype = Object.create(Organism.prototype)
Header.prototype.constructor = Header

// TODO: implement custom notify function
