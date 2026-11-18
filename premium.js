/* Premium motion enhancement for the MateMatch prototype.
   This layer only decorates existing UI; matching and product behavior stay in app.js. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('premium-motion');

  const scrollTrack = document.createElement('div');
  scrollTrack.className = 'premium-scroll-track';
  scrollTrack.setAttribute('aria-hidden', 'true');
  scrollTrack.innerHTML = '<span></span>';
  document.body.appendChild(scrollTrack);
  const scrollFill = scrollTrack.firstElementChild;

  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
    scrollFill.style.width = `${progress}%`;
  };
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });
  updateScrollProgress();

  const observer = !reduceMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' })
    : null;

  function countUp(element) {
    if (reduceMotion || element.dataset.counted === 'true') return;
    const raw = element.textContent.trim();
    const match = raw.match(/(\d+(?:[.,]\d+)?)(\s*%?)/);
    if (!match) return;
    const target = Number(match[1].replace(',', '.'));
    if (!Number.isFinite(target) || target <= 0 || target > 1000) return;
    element.dataset.counted = 'true';
    const suffix = match[2] || '';
    const prefix = raw.slice(0, match.index);
    const decimals = (match[1].split(/[.,]/)[1] || '').length;
    const start = performance.now();
    const duration = 850;
    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      element.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(frame);
      else element.textContent = raw;
    };
    element.textContent = `${prefix}${(0).toFixed(decimals)}${suffix}`;
    requestAnimationFrame(frame);
  }

  function decorate(root) {
    if (!root || root.nodeType !== 1) return;
    const selectors = [
      '.hero-copy', '.hero-visual', '.landing-section .section-wrap', '.landing-footer',
      '.page-heading', '.goal-tabs', '.filter-row', '.section-row', '.profile-grid > *',
      '.suggest-row > *', '.stat-grid > *', '.content > .surface', '.settings-layout > *'
    ].join(',');
    const targets = [];
    if (root.matches?.(selectors)) targets.push(root);
    targets.push(...root.querySelectorAll(selectors));

    targets.forEach((el) => {
      if (el.dataset.premiumReady === 'true') return;
      el.dataset.premiumReady = 'true';
      el.classList.add('premium-reveal');
      const siblings = el.parentElement ? [...el.parentElement.children].filter(child => child.matches?.(selectors)) : [];
      const index = Math.max(0, siblings.indexOf(el));
      el.style.setProperty('--premium-delay', `${Math.min(index * 65, 325)}ms`);
      if (observer) observer.observe(el);
      else el.classList.add('is-visible');
    });

    const counters = [];
    if (root.matches?.('.match-value, .score-num')) counters.push(root);
    counters.push(...root.querySelectorAll('.match-value, .score-num'));
    counters.forEach((el) => {
      if (el.dataset.premiumCounterReady === 'true') return;
      el.dataset.premiumCounterReady = 'true';
      if (observer && !el.classList.contains('is-visible')) {
        const counterObserver = new IntersectionObserver((entries) => {
          if (entries.some(entry => entry.isIntersecting)) {
            countUp(el);
            counterObserver.disconnect();
          }
        }, { threshold: 0.6 });
        counterObserver.observe(el);
      } else countUp(el);
    });
  }

  // Existing app renders synchronously before this script is loaded.
  decorate(document.getElementById('app'));
  decorate(document.getElementById('modal-root'));

  const appObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) decorate(node);
      });
    });
    updateScrollProgress();
  });
  ['app', 'modal-root'].forEach((id) => {
    const target = document.getElementById(id);
    if (target) appObserver.observe(target, { childList: true, subtree: true });
  });

  // The modal root is updated by app.js through innerHTML, so this observer
  // adds a small entrance transition without changing modal interactions.
  const modalObserver = new MutationObserver(() => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop && !backdrop.classList.contains('premium-open')) {
      requestAnimationFrame(() => backdrop.classList.add('premium-open'));
    }
  });
  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalObserver.observe(modalRoot, { childList: true, subtree: true });
})();
