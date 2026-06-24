const track = document.getElementById('track');
const dots = document.querySelectorAll('.sdot');

let page = 0;
const perPage = 2;

function getPages() {
  return Math.ceil(track.children.length / perPage);
}

function goTo(p) {
  const pages = getPages();

  page = Math.max(0, Math.min(p, pages - 1));

  const card = track.children[0];
  const cardWidth = card.offsetWidth + 12;

  const moveX = page * cardWidth * perPage;

  track.style.transform = `translateX(-${moveX}px)`;

  dots.forEach((d, i) => {
    d.classList.toggle('active', i === page);
  });
}

/* touch swipe */
let startX = 0;

track.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;

  if (Math.abs(dx) > 40) {
    goTo(page + (dx < 0 ? 1 : -1));
  }
});

/* mouse drag */
let mx = 0;

track.addEventListener('mousedown', e => {
  mx = e.clientX;
});

track.addEventListener('mouseup', e => {
  const dx = e.clientX - mx;

  if (Math.abs(dx) > 40) {
    goTo(page + (dx < 0 ? 1 : -1));
  }
});

/* wishlist */
function toggleWish(btn) {
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
}

/* color dots */
document.querySelectorAll('.color-dots').forEach(group => {
  group.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', () => {
      group.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});

/* init */
goTo(0);
