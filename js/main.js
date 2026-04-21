/* =========================
   SynAck Solutions — main.js
   Loads shared components on every page.
   Usage: <script src="/js/main.js" defer></script>
   ========================= */

(function () {

  /* ── Component loader ── */
  function loadComponent(selector, url) {
    const el = document.querySelector(selector);
    if (!el) return;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load ' + url + ' — HTTP ' + r.status);
        return r.text();
      })
      .then(html => {
        el.innerHTML = html;
        // After navbar is injected, wire up mobile toggle
        if (selector === '#navbar-mount') initNavbar();
      })
      .catch(err => console.warn('[SynAck]', err));
  }

  /* ── Mobile menu toggle ── */
  function initNavbar() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      menu.classList.toggle('open', !isOpen);
      menu.setAttribute('aria-hidden', String(isOpen));
      document.body.classList.toggle('no-scroll', !isOpen);
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }
  }

  /* ── Scroll-based navbar shadow ── */
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 12);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── Active nav link highlighting ── */
  function initActiveLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
      const href = a.getAttribute('href') || '';
      // Match exact path or parent path
      if (path === href || (href !== '/' && path.startsWith(href.replace('index.html', '')))) {
        a.setAttribute('aria-current', 'page');
        a.style.color = 'rgba(234,240,255,1)';
      }
    });
  }

  /* ── Run on DOM ready ── */
  document.addEventListener('DOMContentLoaded', () => {
    loadComponent('#navbar-mount',  '/components/navbar.html');
    loadComponent('#footer-mount',  '/components/footer.html');
    initNavScroll();

    // Active link runs after navbar loads (handled inside loadComponent callback)
    // but also try immediately in case navbar is already in DOM
    initActiveLink();
  });

})();