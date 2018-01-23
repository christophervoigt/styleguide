
export default function Searchbar(selector, callbacks) {
  if (!(this instanceof Searchbar)) {
    throw new Error('Searchbar needs to be called with the "new" keyword');
  }

  this.selector = selector || '.searchbar';
  this.element = document.querySelector(this.selector);


  // ermöglicht das Erweitern der Funktionalität
  this.callbacks = callbacks || {};
  const keys = Object.keys(this.callbacks);
  keys.forEach((key) => {
    this.element.addEventListener(key, this.callbacks[key]);
  });


  this.button = document.querySelector('.searchbar .button');
  this.button.addEventListener('click', () => { console.log('.searchbar .button', 'clicked'); });

  this.input = document.querySelector('.searchbar input');
  this.input.addEventListener('change', () => { console.log('.searchbar input', 'changed'); });


  // Atome können ebenfalls als Objekt initialisiert werden, wenn
  // interne Logik vorhanden ist (bspw. video-player)

  return this;
}
