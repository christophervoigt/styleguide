
import 'cookieconsent';

export default function cookieConsent(selector = '#cookieConsent') {
  const element = document.querySelector(selector);
  const message = document.querySelector(`${selector} [data-cc-text]`);
  const button = document.querySelector(`${selector} [data-cc-button]`);

  if (element) {
    const options = {
      position: 'bottom',
      showLink: false,
      content: {
        message: message.innerHTML,
        dismiss: button.innerText,
      },
      revokable: true,
    };

    element.remove();
    window.cookieconsent.initialise(options);
  }
}
