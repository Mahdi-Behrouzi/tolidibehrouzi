const track = document.getElementById("track");
const cards = document.querySelectorAll(".product-card");
const dots = document.querySelectorAll(".sdot");

let index = 0;
let isDragging = false;
let startX = 0;
let scrollStart = 0;
let autoPlay;

/* ---------- ACTIVE STATE ---------- */
function setActive() {
  cards.forEach((c, i) => {
    c.classList.toggle("active", i === index);
  });

  dots.forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

/* ---------- MOVE ---------- */
function goTo(i) {
  const max = cards.length - 1;

  index = Math.max(0, Math.min(i, max));

  const card = cards[0];
  const gap = 12;

  const move = (card.offsetWidth + gap) * index;

  track.scrollTo({
    left: move,
    behavior: "smooth"
  });

  setActive();
}

/* ---------- REAL DRAG (SUPER SMOOTH) ---------- */
track.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.pageX;
  scrollStart = track.scrollLeft;
  stopAuto();
});

track.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const x = e.pageX;
  const walk = (startX - x) * 1.5;

  track.scrollLeft = scrollStart + walk;
});

track.addEventListener("mouseup", () => {
  isDragging = false;
  snapToClosest();
  startAuto();
});

track.addEventListener("mouseleave", () => {
  isDragging = false;
});

/* ---------- TOUCH ---------- */
let touchStart = 0;

track.addEventListener("touchstart", (e) => {
  touchStart = e.touches[0].clientX;
  stopAuto();
});

track.addEventListener("touchmove", (e) => {
  const diff = touchStart - e.touches[0].clientX;
  track.scrollLeft += diff;
  touchStart = e.touches[0].clientX;
});

track.addEventListener("touchend", () => {
  snapToClosest();
  startAuto();
});

/* ---------- SNAP ENGINE ---------- */
function snapToClosest() {
  const cardWidth = cards[0].offsetWidth + 12;

  const newIndex = Math.round(track.scrollLeft / cardWidth);

  goTo(newIndex);
}

/* ---------- AUTOPLAY ---------- */
function startAuto() {
  autoPlay = setInterval(() => {
    index++;

    if (index >= cards.length) index = 0;

    goTo(index);
  }, 3000);
}

function stopAuto() {
  clearInterval(autoPlay);
}

/* ---------- WISHLIST ---------- */
function toggleWish(btn) {
  btn.classList.toggle("active");
  btn.textContent = btn.classList.contains("active") ? "♥" : "♡";
}

/* ---------- COLOR DOTS ---------- */
document.querySelectorAll(".color-dots").forEach(group => {
  group.querySelectorAll(".dot").forEach(dot => {
    dot.addEventListener("click", () => {
      group.querySelectorAll(".dot").forEach(d => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });
});

/* ---------- INIT ---------- */
setActive();
startAuto();
