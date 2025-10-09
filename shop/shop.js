/* تنظیمات */
const PER_PAGE = 12;
let PRODUCTS = [];
let CART = JSON.parse(localStorage.getItem('shop_cart') || '[]');
let COMPARE = JSON.parse(localStorage.getItem('shop_compare') || '[]');
let page = 1;
let viewMode = 'grid'; // یا 'list'

/* helper */
function q(sel){return document.querySelector(sel)}
function qAll(sel){return Array.from(document.querySelectorAll(sel))}
function formatPrice(n){ return n.toLocaleString('fa-IR') + ' تومان' }
function saveCart(){ localStorage.setItem('shop_cart', JSON.stringify(CART)); updateCartUI(); }
function saveCompare(){ localStorage.setItem('shop_compare', JSON.stringify(COMPARE)); updateCompareUI(); }

/* load products */
async function loadProducts(){
  try{
    const res = await fetch('data/products.json');
    PRODUCTS = await res.json();
    populateFilters();
    renderProducts();
    updateCartUI();
    updateCompareUI();
  }catch(e){
    console.error("load products error", e);
  }
}

/* populate brand/category dropdowns */
function populateFilters(){
  const brands = Array.from(new Set(PRODUCTS.map(p=>p.brand).filter(Boolean)));
  const cats = Array.from(new Set(PRODUCTS.map(p=>p.category).filter(Boolean)));
  const bsel = q('#brandFilter'); const csel = q('#categoryFilter');
  brands.forEach(b=>{ const opt=document.createElement('option'); opt.value=b; opt.textContent=b; bsel.appendChild(opt)});
  cats.forEach(c=>{ const opt=document.createElement('option'); opt.value=c; opt.textContent=c; csel.appendChild(opt)});
}

/* apply filters & sorting & pagination */
function getFiltered(){
  const qtxt = q('#searchInput').value.trim();
  const min = Number(q('#priceMin').value) || 0;
  const max = Number(q('#priceMax').value) || Infinity;
  const instock = q('#inStock').checked;
  const brand = q('#brandFilter').value;
  const cat = q('#categoryFilter').value;
  const sort = q('#sortBy').value;

  let arr = PRODUCTS.slice();
  if(qtxt) arr = arr.filter(p => p.title.includes(qtxt));
  arr = arr.filter(p => p.price >= min && p.price <= max);
  if(instock) arr = arr.filter(p => p.inStock);
  if(brand) arr = arr.filter(p => p.brand === brand);
  if(cat) arr = arr.filter(p => p.category === cat);

  if(sort === 'price-asc') arr.sort((a,b)=>a.price-b.price);
  else if(sort === 'price-desc') arr.sort((a,b)=>b.price-a.price);
  else if(sort === 'rating') arr.sort((a,b)=>b.rating-b.rating);
  else arr.sort((a,b)=> (b.sold||0) - (a.sold||0));

  return arr;
}

/* render product list */
function renderProducts(){
  const container = q('#productGrid');
  if(!container) return;
  const arr = getFiltered();
  const total = arr.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  if(page>totalPages) page = totalPages;
  const start = (page-1)*PER_PAGE;
  const slice = arr.slice(start, start+PER_PAGE);

  container.innerHTML = '';
  q('#resultsInfo').textContent = `نمایش ${start+1}-${Math.min(start+slice.length, total)} از ${total}`;

  slice.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image || 'https://picsum.photos/seed/p'+p.id+'/600/400'}" alt="${p.title}">
      <h4>${p.title}</h4>
      <div class="meta">
        <div>⭐ ${p.rating || 0} · ${p.sold||0} فروخته</div>
        <div class="prices">
          ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
          <span class="current-price">${formatPrice(p.price)}</span>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn" onclick="viewDetail(${p.id})">جزئیات</button>
        <button class="btn secondary" onclick="toggleCompare(${p.id})">${COMPARE.find(x=>x.id===p.id)?'حذف از مقایسه':'مقایسه'}</button>
        <button class="btn" onclick="addToCart(${p.id})">افزودن</button>
      </div>
    `;
    container.appendChild(card);
  });

  renderPagination(totalPages);
}

/* pagination */
function renderPagination(totalPages){
  const pcon = q('#pagination');
  pcon.innerHTML = '';
  if(totalPages<=1) return;
  const prev = document.createElement('button'); prev.textContent='قبلی'; prev.onclick=()=>{ if(page>1){page--; renderProducts()} };
  const next = document.createElement('button'); next.textContent='بعدی'; next.onclick=()=>{ page++; renderProducts() };
  const info = document.createElement('span'); info.textContent = `صفحه ${page} از ${totalPages}`;
  pcon.appendChild(prev); pcon.appendChild(info); pcon.appendChild(next);
}

/* quick view (modal with tabs) */
async function viewDetail(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const modal = q('#modal'); modal.classList.remove('hidden');
  modal.innerHTML = `
    <div class="card">
      <button class="close-btn" onclick="closeModal()">✕</button>
      <div class="tab-row">
        <div class="tab active" data-tab="info">اطلاعات</div>
        <div class="tab" data-tab="specs">مشخصات</div>
        <div class="tab" data-tab="reviews">نظرات</div>
      </div>
      <div id="tab-info" class="tab-content">
        <div class="detail-flex">
          <img class="detail-img" src="${p.image || 'https://picsum.photos/seed/p'+p.id+'/600/400'}" alt="${p.title}">
          <div class="detail-right">
            <h2>${p.title}</h2>
            <div class="prices">
              ${p.oldPrice?`<span class="old-price">${formatPrice(p.oldPrice)}</span>`:''}
              <span class="current-price">${formatPrice(p.price)}</span>
            </div>
            <p style="color:var(--muted);margin-top:10px">${p.description || ''}</p>
            <div style="margin-top:12px;display:flex;gap:8px">
              <button class="btn" onclick="addToCart(${p.id}); closeModal()">افزودن به سبد</button>
              <button class="btn secondary" onclick="openCart()">مشاهده سبد</button>
            </div>
          </div>
        </div>
      </div>

      <div id="tab-specs" class="tab-content hidden">
        <h4>مشخصات</h4>
        <ul>
          ${(p.specs||[]).map(s=>`<li><strong>${s.key}:</strong> ${s.value}</li>`).join('')}
        </ul>
      </div>

      <div id="tab-reviews" class="tab-content hidden">
        <h4>نظرات</h4>
        <div id="reviewsList">در حال بارگذاری...</div>
        <div style="margin-top:12px">
          <h5>ثبت نظر</h5>
          <input id="revUser" placeholder="نام شما"><br>
          <select id="revRating">${[5,4,3,2,1].map(n=>`<option value="${n}">${n}</option>`).join('')}</select>
          <textarea id="revComment" placeholder="نظر شما..."></textarea><br>
          <button class="btn" onclick="submitReview(${p.id})">ارسال</button>
        </div>
      </div>
    </div>
  `;

  // tabs
  qAll('.tab-row .tab').forEach(t=>{
    t.onclick = ()=>{
      qAll('.tab-row .tab').forEach(x=>x.classList.remove('active'));
      qAll('.tab-content').forEach(x=>x.classList.add('hidden'));
      t.classList.add('active');
      q(`#tab-${t.dataset.tab}`).classList.remove('hidden');
    };
  });

  // load reviews (from local storage or JSONBin if set)
  renderReviews(id);
}

/* close modal */
function closeModal(){ q('#modal').classList.add('hidden'); q('#modal').innerHTML=''; }

/* CART functions */
function updateCartUI(){
  q('#cartCount').textContent = CART.reduce((s,p)=>s+p.count,0) || 0;
  // update cart modal if open
  const items = q('#cartItems'); if(items){ renderCart() }
}

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  const ex = CART.find(x=>x.id===id);
  if(ex) ex.count++;
  else CART.push({...p, count:1});
  saveCart();
  alert('به سبد اضافه شد');
}

/* render cart modal */
function renderCart(){
  const container = q('#cartItems'); if(!container) return;
  container.innerHTML = '';
  if(CART.length===0){ container.innerHTML = '<p>سبد خالی است</p>'; q('#cartTotal').textContent=''; return; }
  let total = 0;
  CART.forEach((it,idx)=>{
    total += it.price * it.count;
    const div = document.createElement('div'); div.className='cart-item';
    div.innerHTML = `
      <img src="${it.image||'https://picsum.photos/seed/p'+it.id+'/200/200'}">
      <div class="title">${it.title}</div>
      <div class="quantity"><button onclick="changeQuantity(${idx},-1)">-</button> ${it.count} <button onclick="changeQuantity(${idx},1)">+</button></div>
      <div class="price">${formatPrice(it.price*it.count)}</div>
      <button onclick="removeCartItem(${idx})">حذف</button>
    `;
    container.appendChild(div);
  });
  q('#cartTotal').textContent = `جمع کل: ${formatPrice(total)}`;
}

/* cart operations */
function changeQuantity(idx,delta){ CART[idx].count = Math.max(1, CART[idx].count + delta); saveCart(); renderCart(); }
function removeCartItem(idx){ CART.splice(idx,1); saveCart(); renderCart(); }
function clearCart(){ CART=[]; saveCart(); renderCart(); }

/* checkout (local) */
function checkoutCart(){
  if(CART.length===0) return alert('سبد خالی است');
  const name = prompt('نام و نام خانوادگی را وارد کنید:');
  const phone = prompt('شماره تماس (مثال: 0912...) را وارد کنید:');
  if(!name || !phone) return alert('اطلاعات ناقص است');
  // در این نسخه بدون سرور فقط یک پیام تأیید نمایش می‌دهیم
  const total = CART.reduce((s,p)=>s+p.price*p.count,0);
  alert(`سفارش ثبت شد\nنام: ${name}\nشماره: ${phone}\nجمع: ${formatPrice(total)}`);
  CART = []; saveCart(); closeCart();
}

/* open/close cart modal */
function openCart(){ q('#cartModal').classList.remove('hidden'); renderCart(); }
function closeCart(){ q('#cartModal').classList.add('hidden'); }

/* compare feature */
function toggleCompare(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const idx = COMPARE.findIndex(x=>x.id===id);
  if(idx>=0) COMPARE.splice(idx,1);
  else COMPARE.push({id:p.id,title:p.title,image:p.image,price:p.price});
  saveCompare(); renderProducts();
}

function openCompare(){ q('#compareModal').classList.remove('hidden'); const c = q('#compareList'); c.innerHTML = ''; if(COMPARE.length===0){ c.innerHTML = '<p>هیچ محصولی برای مقایسه انتخاب نشده</p>'; return }
  COMPARE.forEach(it=>{
    const d = document.createElement('div'); d.style.minWidth='200px';
    d.innerHTML = `<img src="${it.image}" style="width:100px;height:100px;object-fit:cover"><div>${it.title}</div><div>${formatPrice(it.price)}</div>`;
    c.appendChild(d);
  });
}
function closeCompare(){ q('#compareModal').classList.add('hidden'); }

/* reviews: local-first, but you can integrate JSONBin here */
function renderReviews(productId){
  // read from localStorage reviews_store or from product.reviews
  const store = JSON.parse(localStorage.getItem('shop_reviews') || '{}');
  const list = store[productId] || (PRODUCTS.find(p=>p.id===productId).reviews || []);
  const node = q('#reviewsList'); if(!node) return;
  node.innerHTML = '';
  if(!list || list.length===0){ node.innerHTML = '<p>هنوز نظری ثبت نشده</p>'; return; }
  let sum=0;
  list.forEach(r=>{
    sum += r.rating || 0;
    const el = document.createElement('div'); el.className='review-item';
    el.innerHTML = `<strong>${r.user}</strong> · ⭐ ${r.rating}<div style="color:var(--muted)">${r.comment}</div>`;
    node.appendChild(el);
  });
  const avg = (sum / list.length).toFixed(1);
  node.prepend(`<div style="margin-bottom:10px"><strong>میانگین امتیاز: ⭐${avg} از ${list.length} نظر</strong></div>`);
}

function submitReview(productId){
  const user = q('#revUser').value.trim();
  const rating = Number(q('#revRating').value);
  const comment = q('#revComment').value.trim();
  if(!user || !comment) return alert('نام و متن نظر الزامی است');
  const store = JSON.parse(localStorage.getItem('shop_reviews') || '{}');
  if(!store[productId]) store[productId]=[];
  store[productId].push({user,rating,comment});
  localStorage.setItem('shop_reviews', JSON.stringify(store));
  alert('نظر با موفقیت ثبت شد');
  renderReviews(productId);
}

/* misc UI */
function toggleView(){ viewMode = (viewMode==='grid'?'list':'grid'); q('#viewMode').textContent = viewMode==='grid'?'گرید':'لیست'; q('#productGrid').classList.toggle('list-view'); }
function updateCompareUI(){ q('#compareList') && (q('#compareList').innerHTML = COMPARE.length? '' : '<p>هیچ‌چیز برای مقایسه نیست</p>') }
function openCartFromButton(){ openCart(); }

/* bindings */
function setupBindings(){
  q('#searchInput').addEventListener('input', ()=>{ page=1; renderProducts() });
  ['priceMin','priceMax','inStock','brandFilter','categoryFilter','sortBy'].forEach(id=>{
    const el = q('#'+id); if(el) el.addEventListener('change', ()=>{ page=1; renderProducts() });
  });
  q('#resetFilters').addEventListener('click', ()=>{
    q('#priceMin').value=''; q('#priceMax').value=''; q('#inStock').checked=false; q('#brandFilter').value=''; q('#categoryFilter').value=''; page=1; renderProducts();
  });
}

/* init */
(function init(){ loadProducts(); setupBindings(); })();
    
