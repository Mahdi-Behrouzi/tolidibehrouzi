// ===== COMMENTS.JS — ZIZI =====
(function () {
  'use strict';

  // ══════════════════════════════
  //  CONFIG
  // ══════════════════════════════
  const BIN_URL = 'https://api.jsonbin.io/v3/b/6a48fe01da38895dfe2d06dd';
  const API_KEY = '$2a$10$KHZy8R1Fpm5H8eDgoB9uaOXIHP0BowiquBPfSI7JcGJwmMaFxZhja';

  const AVATAR_COLORS = ['#C9A84C','#2d6a4f','#1a2f4d','#7b2d8b','#b91c1c','#0369a1','#d97706'];

  // ══════════════════════════════
  //  UTILS
  // ══════════════════════════════
  function persianDate(iso) {
    try { return new Date(iso).toLocaleDateString('fa-IR', { year:'numeric', month:'long', day:'numeric' }); }
    catch { return ''; }
  }

  function starsHTML(n) {
    n = parseInt(n) || 5;
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function avatarColor(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
  }

  function initials(name) {
    return name ? name.trim().charAt(0) : '؟';
  }

  function showError(msg) {
    const el = document.getElementById('formError');
    el.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> ${msg}`;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 4000);
  }

  // ══════════════════════════════
  //  VALIDATION
  // ══════════════════════════════
  function validate(name, contact, message) {
    if (!name || !contact || !message) return 'همه فیلدها را پر کنید.';
    if (name.length < 2) return 'نام باید حداقل ۲ کاراکتر باشد.';
    if (message.length < 10) return 'متن نظر باید حداقل ۱۰ کاراکتر باشد.';

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneReg = /^(\+98|0098|0)?9\d{9}$/;
    const clean = contact.replace(/[\s\-]/g, '');

    if (!emailReg.test(contact) && !phoneReg.test(clean)) {
      return 'یک ایمیل معتبر یا شماره موبایل ایرانی وارد کنید.';
    }
    return null;
  }

  // ══════════════════════════════
  //  SLIDER
  // ══════════════════════════════
  let sliderEl, cards, currentIdx = 0;

  function buildDots(count) {
    const wrap = document.getElementById('cDots');
    wrap.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.className = 'c-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `نظر ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      wrap.appendChild(d);
    }
  }

  function updateDots(idx) {
    document.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  function goTo(idx) {
    if (!sliderEl || !cards.length) return;
    currentIdx = Math.max(0, Math.min(idx, cards.length - 1));
    const card = cards[currentIdx];
    sliderEl.scrollTo({ left: card.offsetLeft - sliderEl.offsetLeft, behavior: 'smooth' });
    updateDots(currentIdx);
  }

  function initSlider() {
    sliderEl = document.getElementById('approvedComments');
    cards = Array.from(sliderEl.querySelectorAll('.c-card'));
    buildDots(cards.length);

    document.getElementById('cPrev').addEventListener('click', () => goTo(currentIdx + 1));
    document.getElementById('cNext').addEventListener('click', () => goTo(currentIdx - 1));

    // Touch swipe
    let tx = 0;
    sliderEl.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    sliderEl.addEventListener('touchend', e => {
      const diff = tx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) diff > 0 ? goTo(currentIdx - 1) : goTo(currentIdx + 1);
    }, { passive: true });

    // IntersectionObserver برای dot فعال
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          currentIdx = cards.indexOf(en.target);
          updateDots(currentIdx);
        }
      });
    }, { root: sliderEl, threshold: 0.55 });
    cards.forEach(c => obs.observe(c));
  }

  // ══════════════════════════════
  //  LOAD COMMENTS
  // ══════════════════════════════
  function loadComments() {
    fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } })
      .then(r => r.json())
      .then(data => {
        document.getElementById('skeletonWrap').style.display = 'none';

        const all = data.record.comments || [];
        const approved = all.filter(c => c.approved).reverse();

        // آمار
        document.getElementById('totalCount').textContent = all.length;
        document.getElementById('approvedCount').textContent = approved.length + ' نظر منتخب';
        const ratings = approved.filter(c => c.rating).map(c => parseInt(c.rating));
        const avg = ratings.length
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) + '★'
          : '—';
        document.getElementById('avgRating').textContent = avg;

        if (!approved.length) {
          document.getElementById('emptyState').style.display = 'flex';
          return;
        }

        const container = document.getElementById('approvedComments');
        container.innerHTML = '';

        approved.forEach(c => {
          const card = document.createElement('div');
          card.className = 'c-card';
          card.innerHTML = `
            <div class="c-card-top">
              <div class="c-avatar" style="background:${avatarColor(c.name)}">${initials(c.name)}</div>
              <div class="c-card-meta">
                <div class="c-card-name">${c.name}</div>
                <div class="c-card-date">${persianDate(c.createdAt)}</div>
              </div>
              <div class="c-card-stars">${starsHTML(c.rating)}</div>
            </div>
            <p class="c-card-text">${c.message}</p>
            <div class="c-card-footer">
              <span class="c-verified">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                خرید تأیید شده
              </span>
              <button class="c-like" onclick="this.classList.toggle('liked')">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                مفید بود
              </button>
            </div>`;
          container.appendChild(card);
        });

        document.getElementById('cardsOuter').style.display = 'block';
        initSlider();
      })
      .catch(() => {
        document.getElementById('skeletonWrap').style.display = 'none';
        document.getElementById('emptyState').style.display = 'flex';
      });
  }

  // ══════════════════════════════
  //  SUBMIT
  // ══════════════════════════════
  document.getElementById('commentForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');

    const name    = document.getElementById('name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const message = document.getElementById('message').value.trim();
    const ratingEl = document.querySelector('input[name="rating"]:checked');
    const rating  = ratingEl ? ratingEl.value : '5';

    const err = validate(name, contact, message);
    if (err) { showError(err); return; }

    btn.classList.add('loading');
    btn.textContent = 'در حال ارسال...';

    const newComment = {
      name, email: contact, message, rating,
      approved: false,
      createdAt: new Date().toISOString()
    };

    fetch(BIN_URL + '/latest', { headers: { 'X-Master-Key': API_KEY } })
      .then(r => r.json())
      .then(data => {
        const comments = data.record.comments || [];
        comments.push(newComment);
        return fetch(BIN_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
          body: JSON.stringify({ comments })
        });
      })
      .then(() => {
        document.getElementById('commentForm').reset();
        document.getElementById('commentSuccess').classList.add('show');
        btn.classList.remove('loading');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> ارسال نظر';
      })
      .catch(() => {
        showError('خطا در ارسال نظر. دوباره امتحان کنید.');
        btn.classList.remove('loading');
        btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> ارسال نظر';
      });
  });

  // init
  loadComments();

})();
