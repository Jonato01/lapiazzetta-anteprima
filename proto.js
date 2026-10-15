// Interazioni comuni ai prototipi: menu mobile, header allo scroll, caroselli, donazione, copia IBAN.
(function () {
  // fascetta "anteprima": evita che il prototipo venga scambiato per il sito ufficiale
  const badge = document.createElement('a');
  badge.href = 'index.html';
  badge.textContent = 'Anteprima grafica – non è il sito ufficiale · tutte le proposte';
  badge.style.cssText = 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:999;background:#1f2a30;color:#fff;font:700 13px Nunito,sans-serif;padding:8px 16px;border-radius:999px;text-decoration:none;box-shadow:0 6px 20px rgba(0,0,0,.3);white-space:nowrap;max-width:calc(100% - 24px);overflow:hidden;text-overflow:ellipsis';
  document.body.appendChild(badge);

  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  document.querySelectorAll('[data-carousel]').forEach((wrap) => {
    const track = wrap.querySelector('.carousel-track');
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 24 : 300);
    wrap.querySelector('[data-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    wrap.querySelector('[data-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  });

  document.querySelectorAll('.amounts').forEach((group) => {
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      group.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', b === btn));
      const out = document.querySelector(group.dataset.target);
      if (out) out.textContent = btn.dataset.amount + ' €';
    });
  });

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        const old = btn.textContent;
        btn.textContent = 'Copiato!';
        setTimeout(() => (btn.textContent = old), 1600);
      } catch (_) { /* clipboard non disponibile */ }
    });
  });

  const io = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

  // contatori animati nella sezione numeri
  const counters = document.querySelectorAll('[data-count]');
  const co = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, t0 = performance.now();
      const tick = (t) => { const p = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => (co ? co.observe(el) : null));
})();
