// ساده، بدون کتابخانه خارجی. رندر محصولات، فیلتر، مرتب‌سازی، صفحه‌بندی، سبد خرید (localStorage)
const PER_PAGE = 12;
let PRODUCTS = [];
let page = 1;

async function loadProducts(){
  const res = await fetch('data/products.json');
  PRODUCTS = await res.json();
}

function formatPrice(n){ return n.toLocaleString() + ' تومان'; }

function applyFilters(){
  const q = document.getElementById('searchInput').value.trim();
  const min = Number(document.getElementById('priceMin').value) || 0;
  const max = Number(document.getElementById('priceMax').value) || Infinity;
  const inStock = document.getElementById('inStock').checked;
  let arr = PRODUCTS.slice();

  if(q) arr = arr.filter(p => p.title.includes(q));
  arr = arr.filter(p => p.price >= min && p.price <= max);
  if(inStock) arr = arr.filter(p => p.inStock);

  const sort = document.getElementById('sortBy').value;
  if(sort === 'price-asc') arr.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') arr.sort((a,b)=>b.price-a.price);
  else if(sort === 'rating') arr.sort((a,b)=>b.rating-a.rating);
  else arr.sort((a,b)=>b.sold - a.sold);

  return arr;
}

function renderProducts(){
  const out = applyFilters();
  const totalPages = Math.max(1, Math.ceil(out.length / PER_PAGE));
  if(page > totalPages) page = totalPages;
  const start = (page-1) * PER_PAGE;
  const slice = out.slice(start, start + PER_PAGE);

  const container = document.getElementById('productList');
  container.innerHTML = '';
  slice.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}" />
      <div class="info">
        <h4>${p.title}</h4>
        <div class="price">${formatPrice(p.price)}</div>
        ${p.oldPrice ? `<div class="old-price">${formatPrice(p.oldPrice)}</div>` : ''}
        <div style="margin-top:auto;color:#666;font-size:0.9rem;">⭐ ${p.rating} — ${p.sold} فروخته</div>
      </div>
      <div class="actions">
        <button class="btn" onclick="addToCart(${p.id})">افزودن به سبد</button>
        <button class="btn secondary" onclick="viewDetail(${p.id})">مشاهده</button>
      </div>
    `;
    container.appendChild(card);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages){
  const el = document.getElementById('pagination');
  el.innerHTML = '';
  if(totalPages <= 1) return;
  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.textContent = 'قبلی';
  prev.disabled = page === 1;
  prev.onclick = ()=>{ page = Math.max(1, page-1); renderProducts(); };
  el.appendChild(prev);

  const info = document.createElement('span');
  info.textContent = `صفحه ${page} از ${totalPages}`;
  el.appendChild(info);

  const next = document.createElement('button');
  next.className = 'page-btn';
  next.textContent = 'بعدی';
  next.disabled = page === totalPages;
  next.onclick = ()=>{ page = Math.min(totalPages, page+1); renderProducts(); };
  el.appendChild(next);
}

/* CART (localStorage) */
function readCart(){ return JSON.parse(localStorage.getItem('shop_cart') || '[]'); }
function saveCart(c){ localStorage.setItem('shop_cart', JSON.stringify(c)); updateCartUI(); }

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return alert('محصول پیدا نشد');
  const cart = readCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id:p.id,title:p.title,price:p.price,qty:1});
  saveCart(cart);
}

function removeFromCart(id){
  let cart = readCart();
  cart = cart.filter(i=>i.id!==id);
  saveCart(cart);
}

function updateCartUI(){
  const panel = document.getElementById('cartPanel');
  const cart = readCart();
  panel.innerHTML = `<h4>سبد خرید (${cart.length})</h4>`;
  if(cart.length === 0){ panel.innerHTML += '<div class="muted">سبد شما خالی است</div>'; return; }
  cart.forEach(item=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<div>${item.title} × ${item.qty}</div><div>${(item.price*item.qty).toLocaleString()} <button onclick="removeFromCart(${item.id})" style="color:#c33;background:none;border:none;cursor:pointer">حذف</button></div>`;
    panel.appendChild(div);
  });
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const foot = document.createElement('div');
  foot.style.marginTop='8px';
  foot.innerHTML = `<strong>جمع: ${total.toLocaleString()} تومان</strong><div style="margin-top:8px;"><button class="btn" onclick="checkout()">تسویه</button></div>`;
  panel.appendChild(foot);
}

function checkout(){
  alert('اینجا می‌تونی لاجیک تسویه را پیاده کنی (ارسال به سرور یا باز کردن صفحه پرداخت).');
}

/* Modal */
function viewDetail(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');
  modal.innerHTML = `<div class="card">
    <button style="float:left" onclick="closeModal()">بستن ✕</button>
    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <img src="${p.image}" style="width:320px;height:320px;object-fit:cover;border-radius:8px" />
      <div style="flex:1">
        <h2>${p.title}</h2>
        <div style="font-weight:700;margin:8px 0">${formatPrice(p.price)}</div>
        ${p.oldPrice ? `<div class="old-price">${formatPrice(p.oldPrice)}</div>` : ''}
        <p style="color:#555">توضیحات نمونه: این قسمت را با توضیحات واقعی محصول جایگزین کن.</p>
        <div style="margin-top:12px">
          <button class="btn" onclick="addToCart(${p.id}); closeModal()">افزودن به سبد</button>
          <button class="btn secondary" onclick="checkout()">خرید سریع</button>
        </div>
      </div>
    </div>
  </div>`;
}

function closeModal(){ document.getElementById('modal').classList.add('hidden'); document.getElementById('modal').innerHTML=''; }

/* event bind */
function setup(){
  document.getElementById('searchInput').addEventListener('input', () => { page = 1; renderProducts(); });
  ['priceMin','priceMax','inStock','sortBy'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('change', ()=>{ page = 1; renderProducts(); });
  });
  document.getElementById('resetFilters').addEventListener('click', ()=>{
    document.getElementById('priceMin').value='0';
    document.getElementById('priceMax').value='10000000';
    document.getElementById('inStock').checked=false;
    document.getElementById('sortBy').value='popular';
    page = 1; renderProducts();
  });
}

/* init */
(async function(){
  await loadProducts();
  setup();
  renderProducts();
  updateCartUI();
})();
