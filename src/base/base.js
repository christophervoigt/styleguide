
import cookieconsent from './cookieconsent/cookieconsent';

export default function app() {
  this.instances = {};

  function init() {
    cookieconsent('#cookieconsent');
  }

  init();
}
