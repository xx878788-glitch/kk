'use strict';
const dialog = document.querySelector('#image-dialog');
const enlargedImage = document.querySelector('#dialog-image');
const caption = document.querySelector('#dialog-caption');
let imageTrigger;
if (dialog && typeof dialog.showModal === 'function') {
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => {
      imageTrigger = button;
      enlargedImage.src = button.dataset.image;
      enlargedImage.alt = button.querySelector('img').alt;
      caption.textContent = button.dataset.caption;
      dialog.showModal();
      document.body.classList.add('dialog-open');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (imageTrigger) imageTrigger.focus({preventScroll: true});
  });
} else {
  document.querySelectorAll('[data-image]').forEach(button => {
    button.addEventListener('click', () => window.open(button.dataset.image, '_blank', 'noopener,noreferrer'));
  });
}
