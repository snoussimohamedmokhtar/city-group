/* =====================================================
   CITY GROUP SARL — main.js
   Animations, Cursor, Navbar, Scroll Effects
   ===================================================== */

(function () {
  'use strict';

  // ===== DOM READY =====
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupLoader();
    setupCursor();
    setupNavbar();
    setupMobileMenu();
    setActiveNav();
    spawnParticles();
    setupScrollAnimations();
    setupCounters();
    setupParallax();
    setupProductFilter();
    setupContactForm();
    setupPageTransitions();
    setupLazyImages();
    setupMagneticBtns();
  }

  // ===== LOADING SCREEN =====
  function setupLoader() {
    const loader = document.getElementById('loader');
    if (!loader) { setupScrollAnimations(); return; }

    document.body.style.overflow = 'hidden';

    const onLoad = function () {
      setTimeout(function () {
        loader.classList.add('out');
        document.body.style.overflow = '';
        setTimeout(function () { loader.remove(); }, 800);
      }, 2400);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }
  }

  // ===== CUSTOM CURSOR =====
  function setupCursor() {
    if (window.innerWidth <= 768) return;
    const cursor   = document.querySelector('.cursor');
    const dot      = document.querySelector('.cursor-dot');
    const ring     = document.querySelector('.cursor-ring');
    if (!cursor) return;

    let mx = 0, my = 0;
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

    (function tick() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(tick);
    })();

    // Hover states
    const hoverSel = 'a, button, .product-card, .f-btn, input, textarea, select, .s-link, .social-link, .ctc-item, .val-card';
    document.querySelectorAll(hoverSel).forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
    });

    document.addEventListener('mousedown', function () { dot.style.transform = 'translate(-50%,-50%) scale(.6)'; });
    document.addEventListener('mouseup',   function () { dot.style.transform = ''; });
  }

  // ===== NAVBAR =====
  function setupNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;
    const onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ===== MOBILE MENU =====
  function setupMobileMenu() {
    const burger  = document.querySelector('.hamburger');
    const overlay = document.querySelector('.nav-mobile');
    if (!burger || !overlay) return;

    burger.addEventListener('click', function () {
      const open = burger.classList.toggle('open');
      overlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    overlay.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== ACTIVE NAV LINK =====
  function setActiveNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (l) {
      const href = l.getAttribute('href') || '';
      if (href === page || (page === 'index.html' && href === 'index.html')) {
        l.classList.add('active');
      }
    });
  }

  // ===== PARTICLES =====
  function spawnParticles() {
    const container = document.querySelector('.particles');
    if (!container) return;
    const colors = ['#B8621A', '#C9981A', '#EDB02A', '#4A7A3D', '#6B3710', '#2B5022'];
    for (let i = 0; i < 18; i++) {
      const p    = document.createElement('div');
      p.className = 'particle';
      const sz   = Math.random() * 45 + 18;
      const dur  = Math.random() * 18 + 14;
      const del  = -(Math.random() * dur);
      const left = Math.random() * 100;
      const rot  = Math.random() * 360;
      const c    = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = [
        'width:' + sz + 'px',
        'height:' + (sz * 0.6) + 'px',
        'background:' + c,
        'left:' + left + '%',
        'animation-duration:' + dur + 's',
        'animation-delay:' + del + 's',
        'transform:rotate(' + rot + 'deg)'
      ].join(';');
      container.appendChild(p);
    }
  }

  // ===== SCROLL ANIMATIONS (IntersectionObserver) =====
  function setupScrollAnimations() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const del = parseInt(el.dataset.delay || 0) * 110;
        setTimeout(function () { el.classList.add('visible'); }, del);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    els.forEach(function (el) { observer.observe(el); });
  }

  // ===== COUNTERS =====
  function setupCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur    = 1800;
        const start  = performance.now();
        observer.unobserve(el);

        (function tick(now) {
          const prog = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - prog, 4);
          el.textContent = Math.round(ease * target) + suffix;
          if (prog < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  // ===== PARALLAX =====
  function setupParallax() {
    const els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    window.addEventListener('scroll', function () {
      const sy = window.scrollY;
      els.forEach(function (el) {
        const speed  = parseFloat(el.dataset.parallax) || 0.25;
        const rect   = el.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - rect.top) * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
    }, { passive: true });
  }

  // ===== PRODUCT FILTER =====
  function setupProductFilter() {
    const btns  = document.querySelectorAll('.f-btn');
    const items = document.querySelectorAll('.product-item');
    if (!btns.length) return;

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        items.forEach(function (item) {
          const match = filter === 'all' || item.dataset.cat === filter;
          if (match) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(.92)';
            requestAnimationFrame(function () {
              setTimeout(function () {
                item.style.transition = 'opacity .45s ease, transform .45s var(--ease-bounce)';
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 20);
            });
          } else {
            item.style.transition = 'opacity .35s ease, transform .35s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(.9)';
            setTimeout(function () { item.style.display = 'none'; }, 380);
          }
        });
      });
    });
  }

  // ===== CONTACT FORM =====
  function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const msgEl = document.getElementById('formSuccess');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>✓ Message envoyé!</span>';
      btn.style.background = '#4A7A3D';
      btn.disabled = true;
      if (msgEl) msgEl.classList.add('show');

      setTimeout(function () {
        btn.innerHTML = orig;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
        if (msgEl) msgEl.classList.remove('show');
      }, 3500);
    });
  }

  // ===== PAGE TRANSITIONS =====
  function setupPageTransitions() {
    const veil = document.querySelector('.page-veil');
    if (!veil) return;

    document.querySelectorAll('a').forEach(function (link) {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('#') || href.startsWith('mailto:') ||
          href.startsWith('tel:') || link.target === '_blank') return;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        veil.style.transition = 'transform .52s cubic-bezier(.95,.05,.8,.04)';
        veil.style.transformOrigin = 'bottom';
        veil.style.transform = 'scaleY(1)';
        setTimeout(function () { window.location.href = href; }, 540);
      });
    });
  }

  // ===== LAZY IMAGES =====
  function setupLazyImages() {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity .5s ease';
        img.addEventListener('load', function () { this.style.opacity = '1'; });
      }
    });
  }

  // ===== MAGNETIC BUTTONS =====
  function setupMagneticBtns() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top  - r.height / 2) * 0.18;
        btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

})();
