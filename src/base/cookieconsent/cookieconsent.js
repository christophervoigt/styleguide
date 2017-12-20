
import cookieconsent from 'cookieconsent';

export default ($target) => {
  const options = {
    showLink: false,
    elements: {
      dismiss: '<a aria-label="dismiss cookie message" tabindex="0" class="cc-btn cc-dismiss">{{dismiss}}</a>',
    },
  };

  window.addEventListener('load', () => {
    options.content = {
      message: $target.children('[data-cc-text]').html(),
      dismiss: $target.children('[data-cc-button]').text(),
    };
    cookieconsent.initialise(options);

    $target.remove();
  });
};
