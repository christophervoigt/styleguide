
import highlight from './highlight/highlight';

export default function app() {
  this.instances = {};

  function init() {
    highlight('pre code');
  }

  init();
}
