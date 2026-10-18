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
  const navScroller = nav.querySelector('.nav-scroll') || nav;
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
    if (!currentLink || !navScroller.contains(currentLink) || navScroller.scrollWidth <= navScroller.clientWidth) return;
    const box = navScroller.getBoundingClientRect();
    const linkBox = currentLink.getBoundingClientRect();
    if (linkBox.left < box.left + 16 || linkBox.right > box.right - 16) {
      navScroller.scrollTo({
        left: Math.max(0, navScroller.scrollLeft + linkBox.left - box.left - 20),
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

// Give native course and FAQ disclosures a small content entrance.
(() => {
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 document.addEventListener('toggle', event => {
  const item = event.target;
  if (reduced.matches || item.tagName !== 'DETAILS' || !item.open) return;
  if (!item.matches('.course, .faq details')) return;
  const content = item.querySelector('.course-content') || item.querySelector('p');
  if (!content || typeof content.animate !== 'function') return;
  content.animate([{opacity:.3, transform:'translateY(6px)'}, {opacity:1, transform:'translateY(0)'}], {duration:240, easing:'cubic-bezier(0,0,.5,1)'});
 }, true);
})();

// Keep mobile chapter navigation out of the reading column until requested.
(() => {
 const nav = document.querySelector('.section-nav');
 const button = nav && nav.querySelector('.chapter-toggle');
 if (!button) return;
 const setOpen = open => {
  nav.classList.toggle('menu-open', open);
  button.setAttribute('aria-expanded', String(open));
 };
 button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
 nav.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => setOpen(false)));
 document.addEventListener('pointerdown', event => {if (!nav.contains(event.target)) setOpen(false);});
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
   setOpen(false);
   button.focus({preventScroll:true});
  }
 });
 const breakpoint = window.matchMedia('(max-width: 760px)');
 const closeOnResize = () => setOpen(false);
 if (breakpoint.addEventListener) breakpoint.addEventListener('change', closeOnResize);
 else if (breakpoint.addListener) breakpoint.addListener(closeOnResize);
})();
