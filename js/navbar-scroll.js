/* =============================================================
   SynAck — navbar scroll behaviour
   Adds .nav--scrolled when page scrolls past 10px
   Include this in main.js or as a separate <script defer>
   ============================================================= */

(function () {
  function initNavScroll() {
    const nav = document.getElementById('site-nav');
    if (!nav) return;

    const THRESHOLD = 10; // px before glass kicks in

    function update() {
      if (window.scrollY > THRESHOLD) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update(); // run immediately on load
  }

  function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu   = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    function open() {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    // Close on any link tap
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

    // Close on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') close();
    });

    // Close on backdrop click
    menu.addEventListener('click', e => {
      if (e.target === menu) close();
    });
  }

  function initDropdowns() {
    // Keyboard accessibility for dd-btn buttons
    document.querySelectorAll('.dd-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        // Close all others
        document.querySelectorAll('.dd-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
        btn.setAttribute('aria-expanded', String(!expanded));
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', e => {
      if (!e.target.closest('.dd')) {
        document.querySelectorAll('.dd-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
      }
    });
  }

  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavScroll();
      initMobileMenu();
      initDropdowns();
    });
  } else {
    initNavScroll();
    initMobileMenu();
    initDropdowns();
  }
})();