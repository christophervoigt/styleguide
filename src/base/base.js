
import cookieconsent from './cookieconsent/cookieconsent';

export default function base() {
  function init() {
    cookieconsent('#cookieconsent');
  }

  init();
}
