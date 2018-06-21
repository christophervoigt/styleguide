
export default function Searchbar(selector = '.searchbar', callbacks = {}) {
  const element = document.querySelector(selector);
  if (element) {
    // ermöglicht das Erweitern der Funktionalität
    const keys = Object.keys(callbacks);
    keys.forEach((key) => {
      element.addEventListener(key, callbacks[key]);
    });
  }

  const button = document.querySelector('.searchbar .button');
  if (button) {
    button.addEventListener('click', () => {
      console.log('searchbar:', 'you clicked my button');
    });
  }

  const input = document.querySelector('.searchbar input');
  if (input) {
    input.addEventListener('change', () => {
      console.log('searchbar:', 'you changed my input');
    });
  }

  // Atome können ebenfalls als Objekt initialisiert werden, wenn
  // interne Logik vorhanden ist (bspw. video-player)

  return this;
}
