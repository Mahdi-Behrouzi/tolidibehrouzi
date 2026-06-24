const track = document.getElementById('track');
const dots = document.querySelectorAll('.sdot');

let page = 0;

function getPerPage() {
  return 2; // چون هر صفحه 2 تا کارت داری
}

function getPages() {
  return Math.ceil(track.children.length / getPerPage());
}

function goTo(p) {
  const pages = getPages();

  page = Math.max(0, Math.min(p, pages - 1));

  const card = track.children[0];
  const cardW = card.offsetWidth + 12;

  track.style.transform = `translateX(-${page * (cardW * getPerPage())}px)`;

  dots.forEach((d, i) => d.classList.toggle('active', i === page));
}

// swipe موبایل
let startX = 0;

track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchend', e => {
  let dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) {
    goTo(page + (dx < 0 ? 1 : -1));
  }
});

// mouse drag
let mx = 0;

track.addEventListener('mousedown', e => mx = e.clientX);

track.addEventListener('mouseup', e => {
  let dx = e.clientX - mx;
  if (Math.abs(dx) > 40) {
    goTo(page + (dx < 0 ? 1 : -1));
  }
});

// wishlist
function toggleWish(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
}

// رنگ‌ها
document.querySelectorAll('.color-dots').forEach(group => {
  group.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      group.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});

// شروع اولیه
goTo(0);
