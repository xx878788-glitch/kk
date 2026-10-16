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


// Keep native scrolling; animate only headings, photos and resource cards.
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = Array.from(document.querySelectorAll(
    '.section-heading, .story-copy h3, .story-quote, .story-photo, .life-note, ' +
    '.academy-banner, .course-aside, .support-card, .tools-heading, .tool-feature, ' +
    '.classroom-grid figure, .feedback-heading, .feedback-image, .start-main, .faq-layout > div:first-child'
  ));
  let observer;
  const showAll = () => {
    if (observer) observer.disconnect();
    targets.forEach(target => {
      target.classList.remove('reveal-pending');
      target.classList.remove('is-revealed');
      target.style.removeProperty('--reveal-delay');
    });
  };
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    try {
      if (window.matchMedia('(min-width: 761px)').matches) {
        document.querySelectorAll('.support-grid, .tool-grid, .classroom-grid').forEach(group => {
          Array.from(group.children).forEach((card, index) => {
            card.style.setProperty('--reveal-delay', Math.min(index, 2) * 70 + 'ms');
          });
        });
      }
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, {threshold: 0, rootMargin: '0px 0px 64px 0px'});
      targets.forEach(target => {
        if (target.getBoundingClientRect().top < window.innerHeight - 24) return;
        target.classList.add('reveal-pending');
        observer.observe(target);
      });
    } catch (_) {
      showAll();
    }
  }
  const handleMotionChange = event => { if (event.matches) showAll(); };
  if (motionPreference.addEventListener) motionPreference.addEventListener('change', handleMotionChange);
  else if (motionPreference.addListener) motionPreference.addListener(handleMotionChange);

  const nav = document.querySelector('.section-nav');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = links.map(link => document.getElementById(link.getAttribute('href').slice(1)));
  let activeId = null;
  let scheduled = false;
  const updateNavigation = () => {
    scheduled = false;
    const line = nav.getBoundingClientRect().height + Math.min(window.innerHeight * .22, 160);
    let nextId = null;
    sections.forEach(section => {
      if (section && section.getBoundingClientRect().top <= line) nextId = section.id;
    });
    if (nextId === activeId) return;
    activeId = nextId;
    let currentLink;
    links.forEach(link => {
      if (link.getAttribute('href') === '#' + activeId) {
        link.setAttribute('aria-current', 'location');
        currentLink = link;
      } else {
        link.removeAttribute('aria-current');
      }
    });
    if (!currentLink || nav.scrollWidth <= nav.clientWidth) return;
    const box = nav.getBoundingClientRect();
    const linkBox = currentLink.getBoundingClientRect();
    if (linkBox.left < box.left + 16 || linkBox.right > box.right - 16) {
      nav.scrollTo({
        left: Math.max(0, nav.scrollLeft + linkBox.left - box.left - 20),
        behavior: motionPreference.matches ? 'auto' : 'smooth'
      });
    }
  };
  const scheduleNavigation = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateNavigation);
  };
  window.addEventListener('scroll', scheduleNavigation, {passive: true});
  window.addEventListener('resize', scheduleNavigation, {passive: true});
  window.addEventListener('pageshow', scheduleNavigation);
  document.addEventListener('toggle', scheduleNavigation, true);
  updateNavigation();
})();
