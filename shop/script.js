const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sideMenu = document.getElementById('side-menu');
const overlay = document.getElementById('menu-overlay');

function openMenu() {
    overlay.classList.remove('hidden');
    setTimeout(() => overlay.classList.remove('opacity-0'), 10);
    sideMenu.classList.remove('translate-x-full');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    sideMenu.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => overlay.classList.add('hidden'), 300);
    document.body.style.overflow = 'auto';
}

if(menuBtn) menuBtn.addEventListener('click', openMenu);
if(closeBtn) closeBtn.addEventListener('click', closeMenu);
if(overlay) overlay.addEventListener('click', closeMenu);
