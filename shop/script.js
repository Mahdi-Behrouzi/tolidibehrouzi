// ===== ZIZI CHARISMA — SCRIPT.JS =====
(function () {
  'use strict';

  /* ---- HERO SLIDER ---- */
  const track      = document.getElementById('heroTrack');
  const slides     = document.querySelectorAll('.hero-slide');
  const dots       = document.querySelectorAll('.hero-dot');
  const thumbs     = document.querySelectorAll('.hero-thumb');
  const prevBtn    = document.getElementById('heroPrev');
  const nextBtn    = document.getElementById('heroNext');
  const numEl      = document.getElementById('heroNum');
  const progressEl = document.getElementById('heroProgress');

  const TOTAL    = slides.length;
  const INTERVAL = 5000;
  let current  = 0;
  let timer    = null;
  let progTimer = null;
  let startX   = 0;
  let dragging = false;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    thumbs[current].classList.remove('active');

    current = (idx + TOTAL) % TOTAL;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    thumbs[current].classList.add('active');

    // RTL: slide from right so positive offset = moved left
    track.style.transform = `translateX(${current * 100}%)`;

    numEl.textContent = String(current + 1).padStart(2, '0');
    startProgress();
  }

  function startProgress() {
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    clearTimeout(progTimer);
    progTimer = setTimeout(() => {
      progressEl.style.transition = `width ${INTERVAL}ms linear`;
      progressEl.style.width = '100%';
    }, 30);
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }
  function stopAuto() {
    clearInterval(timer);
    clearTimeout(progTimer);
  }

  prevBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });

  dots.forEach(d => d.addEventListener('click', () => {
    goTo(parseInt(d.dataset.i));
    startAuto();
  }));

  thumbs.forEach(t => t.addEventListener('click', () => {
    goTo(parseInt(t.dataset.i));
    startAuto();
  }));

  // Touch swipe
  const hero = document.getElementById('hero');
  hero.addEventListener('touchstart', e => { startX = e.touches[0].clientX; dragging = true; stopAuto(); }, { passive: true });
  hero.addEventListener('touchend', e => {
    if (!dragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current - 1) : goTo(current + 1);
    dragging = false; startAuto();
  }, { passive: true });

  // Mouse drag
  hero.addEventListener('mousedown', e => { startX = e.clientX; dragging = true; stopAuto(); });
  document.addEventListener('mouseup', e => {
    if (!dragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 60) diff > 0 ? goTo(current - 1) : goTo(current + 1);
    dragging = false; startAuto();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  hero.addEventListener('mouseenter', stopAuto);
  hero.addEventListener('mouseleave', startAuto);

  goTo(0);
  startAuto();

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('elevated', window.scrollY > 20);
  }, { passive: true });

  /* ---- HAMBURGER + SIDEBAR ---- */
  const hamburger      = document.getElementById('hamburger');
  const sidebar        = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarClose   = document.getElementById('sidebarClose');

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
  hamburger.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  /* ---- SEARCH BAR ---- */
  const searchToggle = document.getElementById('searchToggle');
  const searchBar    = document.getElementById('searchBar');
  const searchClose  = document.getElementById('searchClose');
  const searchInput  = searchBar.querySelector('.search-input');

  searchToggle.addEventListener('click', () => {
    const isOpen = searchBar.classList.toggle('open');
    if (isOpen) setTimeout(() => searchInput.focus(), 100);
  });
  searchClose.addEventListener('click', () => searchBar.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') searchBar.classList.remove('open');
  });

  /* ---- CART DRAWER ---- */
  const cartBtn       = document.querySelector('.cart-btn');
  const cartDrawer    = document.getElementById('cartDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose   = document.getElementById('drawerClose');

  function openCart() {
    cartDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    cartDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  cartBtn.addEventListener('click', openCart);
  drawerClose.addEventListener('click', closeCart);
  drawerOverlay.addEventListener('click', closeCart);

  /* ---- FAB SCROLL-TO-TOP ---- */
  const fabTop = document.getElementById('fabTop');
  window.addEventListener('scroll', () => {
    fabTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  fabTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---- WISHLIST TOGGLE ---- */
  document.querySelectorAll('.wishlist-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });

  /* ---- CATEGORY PILLS ---- */
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });

  /* ---- QUANTITY CONTROLS (cart drawer) ---- */
  document.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ctrl = btn.closest('.qty-ctrl');
      const valEl = ctrl.querySelector('.qty-val');
      let val = parseInt(valEl.textContent);
      if (btn.textContent === '+') val = Math.min(val + 1, 99);
      else val = Math.max(val - 1, 1);
      valEl.textContent = val;
    });
  });

})();
