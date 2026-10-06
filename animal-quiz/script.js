(() => {
  const answers = Array.from(document.querySelectorAll('.answer'));
  const valid = new Set(['A', 'B', 'C', 'D']);
  let switching = false;

  function selectedFromLocation() {
    const hash = /^#r=([A-D])$/i.exec(location.hash);
    const query = new URLSearchParams(location.search).get('r');
    const key = hash ? hash[1].toUpperCase() : query?.toUpperCase();
    return valid.has(key) ? key : null;
  }

  function openResult(key, scroll = false) {
    const selected = answers.find((item) => item.dataset.result === key);
    if (!selected) return;
    switching = true;
    answers.forEach((item) => { item.open = item === selected; });
    switching = false;
    if (scroll) {
      requestAnimationFrame(() => selected.scrollIntoView({
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start'
      }));
    }
  }

  answers.forEach((answer) => {
    answer.addEventListener('toggle', () => {
      if (switching) return;
      if (answer.open) {
        switching = true;
        answers.forEach((other) => { if (other !== answer) other.open = false; });
        switching = false;
        history.replaceState(null, '', '#r=' + answer.dataset.result);
      } else if (!answers.some((item) => item.open)) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    });
  });

  window.addEventListener('hashchange', () => {
    const key = selectedFromLocation();
    if (key) openResult(key, true);
  });

  const initial = selectedFromLocation();
  if (initial) {
    openResult(initial);
    requestAnimationFrame(() => {
      document.getElementById('answer-' + initial)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
  }

  document.querySelectorAll('.copy-coupon').forEach((button) => {
    button.addEventListener('click', async () => {
      const code = button.dataset.copyCoupon;
      let copied = false;
      try {
        await navigator.clipboard.writeText(code);
        copied = true;
      } catch {
        const field = document.createElement('textarea');
        field.value = code;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        try { copied = document.execCommand('copy'); } catch { /* Manual copy remains available. */ }
        field.remove();
      }
      button.textContent = copied ? '已複製' : '長按 Karen';
      button.setAttribute('aria-label', copied ? '折扣碼 Karen 已複製' : '請長按折扣碼 Karen 手動複製');
      window.setTimeout(() => {
        button.textContent = '複製';
        button.setAttribute('aria-label', '複製折扣碼 Karen');
      }, 2500);
    });
  });
})();
