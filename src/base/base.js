
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle';
import collapsable from './collapsable/collapsable';
import cookieConsent from './cookieConsent/cookieConsent';
import lazyImages from './lazyImages/lazyImages';

export default function base() {
  collapsable();
  cookieConsent();
  lazyImages();

  window.$ = $;
}
