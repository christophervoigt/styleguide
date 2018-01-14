
import Searchbar from '../../molecules/searchbar/searchbar';

export default function Header(selector) {
  if (!(this instanceof Header)) {
    throw new Error('Header needs to be called with the "new" keyword');
  }

  this.selector = selector || 'header';
  this.element = document.querySelector(this.selector);


  this.searchbar = new Searchbar('header .searchbar', {
    mouseover: () => {
      console.log('header .searchbar', 'hovered');
    },
  });

  // alternativ:
  // new Searchbar();
  // new Searchbar('header .searchbar');

  // -> Logik der Searchbar selbst wird immer ausgeführt
  // -> Callbacks ermöglichen das Erweitern der Funktionalität
}
