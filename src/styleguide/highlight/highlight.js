/* global $ */

import hljs from 'highlightjs';

function copyToClipboard(content) {
  const $temp = $('<textarea>');
  $('body').append($temp);
  $temp.val(content).select();
  document.execCommand('copy');
  $temp.remove();
}

$('pre code').each(() => {
  let html = $(this).html();
  html = html.replace(/^\r?\n/g, '');

  const spaces = html.match(/^[ ]*/);
  html = html.replace(new RegExp(`^${spaces}`), '');
  html = html.replace(new RegExp(`\n${spaces}`, 'g'), '\n');
  $(this).text(html);

  hljs.highlightBlock($(this).get(0));

  $(this).dblclick(() => {
    copyToClipboard(html);
    const shot = $('<div style="position:absolute; z-index:999; top: 0; width: 100%; height: 100%; background-color: #ffffff;"></div>');
    $(this).closest('.toggle-container').append(shot);
    shot.fadeOut(200, () => {
      $(this).remove();
    });
  });
});
