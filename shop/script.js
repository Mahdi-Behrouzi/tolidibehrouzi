// قلب محصولات
document.querySelectorAll('.wish').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

// اسکرول هدر
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// افزودن به سبد
document.querySelectorAll('.btn-buy').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = '✓ اضافه شد';
    btn.style.background = '#c9a96e';
    setTimeout(() => {
      btn.textContent = 'افزودن به سبد';
      btn.style.background = '#1a1a1a';
    }, 2000);
  });
});
