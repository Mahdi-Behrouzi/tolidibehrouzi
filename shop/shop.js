const BIN_ID = "68e50c67d0ea881f40986859"; // Bin جدید نظرات فروشگاه
const API_KEY = "$2a$10$BAz3UXrj2Hs4CTSu9Sx.SORA0uPP1H62lvU/gZsySq7/iEzRRnAVe";
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// سبد خرید
let CART = [];

// نمونه محصولات (همچنان با JSON، میتونی محصولات جدید اضافه کنی)
let PRODUCTS = [];

// بارگذاری محصولات از JSON محلی
async function loadProducts() {
  const res = await fetch('data/products.json');
  PRODUCTS = await res.json();
  renderProducts();
}

// نمایش محصولات
function renderProducts(filter = {}) {
  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';
  let list = [...PRODUCTS];

  // فیلتر برند یا دسته‌بندی
  if (filter.brand) list = list.filter(p => p.brand === filter.brand);
  if (filter.category) list = list.filter(p => p.category === filter.category);

  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <div>⭐ ${p.rating} (${p.reviews ? p.reviews.length : 0})</div>
      <div class="price">
        ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
        <span class="current-price">${formatPrice(p.price)}</span>
      </div>
      <button onclick="viewDetail(${p.id})">جزئیات</button>
      <button onclick="addToCart(${p.id})">سبد خرید</button>
    `;
    container.appendChild(div);
  });
}

// تابع قیمت
function formatPrice(num) {
  return num.toLocaleString('fa-IR') + ' تومان';
}

// باز کردن جزئیات محصول
function viewDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');

  modal.innerHTML = `
    <div class="card">
      <button class="close-btn" onclick="closeModal()">✕</button>
      <div class="detail-tabs">
        <button class="tab-btn active" data-tab="info">اطلاعات</button>
        <button class="tab-btn" data-tab="specs">مشخصات</button>
        <button class="tab-btn" data-tab="reviews">نظرات</button>
      </div>

      <div class="tab-content" id="tab-info">
        <div class="flex-row">
          <img src="${p.image}" class="detail-img">
          <div class="detail-right">
            <h2>${p.title}</h2>
            <div class="price">
              ${p.oldPrice ? `<span class="old-price">${formatPrice(p.oldPrice)}</span>` : ''}
              <span class="current-price">${formatPrice(p.price)}</span>
            </div>
            <p>${p.description || 'توضیحی برای این محصول وجود ندارد.'}</p>
            <div class="buttons">
              <button class="btn" onclick="addToCart(${p.id}); closeModal()">افزودن به سبد</button>
              <button class="btn secondary" onclick="checkout()">خرید سریع</button>
            </div>
          </div>
        </div>

        <div class="related-products">
          <h3>پیشنهادات مرتبط</h3>
          <div id="relatedList" class="related-list"></div>
        </div>
      </div>

      <div class="tab-content hidden" id="tab-specs">
        <h3>مشخصات فنی</h3>
        <ul>
          ${(p.specs || []).map(s => `<li><strong>${s.key}:</strong> ${s.value}</li>`).join('')}
        </ul>
      </div>

      <div class="tab-content hidden" id="tab-reviews">
        <h3>نظرات کاربران</h3>
        <div id="reviewsList"></div>
        <div class="review-form">
          <h4>ثبت نظر شما</h4>
          <input id="revUser" placeholder="نام شما"><br>
          <select id="revRating">${[5,4,3,2,1].map(n=>`<option value="${n}">${n}</option>`).join('')}</select>
          <textarea id="revComment" placeholder="نظر شما..."></textarea><br>
          <button class="btn" onclick="submitReview(${p.id})">ارسال نظر</button>
        </div>
      </div>
    </div>
  `;

  // فعال کردن تب‌ها
  modal.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      modal.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
      modal.querySelector(`#tab-${tab}`).classList.remove('hidden');
    });
  });

  // بارگذاری پیشنهادات مرتبط
  const related = PRODUCTS.filter(x => x.id !== p.id).slice(0,3);
  const relDiv = document.getElementById('relatedList');
  related.forEach(r => {
    const d = document.createElement('div');
    d.className = 'related-item';
    d.innerHTML = `<img src="${r.image}"><div>${r.title}</div>`;
    d.onclick = ()=>viewDetail(r.id);
    relDiv.appendChild(d);
  });

  // بارگذاری نظرات
  renderReviews(id);
}

// بستن مودال
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal').innerHTML = '';
}

// سبد خرید
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  CART.push(p);
  alert(`${p.title} به سبد خرید اضافه شد ✅`);
}

// خرید سریع
function checkout() {
  if (CART.length === 0) return alert("سبد خرید خالی است!");
  let total = CART.reduce((sum,p)=>sum+p.price,0);
  alert(`مجموع مبلغ: ${total.toLocaleString('fa-IR')} تومان\nمتشکریم از خرید شما!`);
  CART = [];
}

// -------------------
// JSONBin نظرات
// -------------------
async function loadReviews() {
  try {
    const res = await fetch(BIN_URL + "/latest", {
      headers: { "X-Master-Key": API_KEY }
    });
    const data = await res.json();
    return data.record.reviews || {};
  } catch(err) {
    console.error(err);
    return {};
  }
}

async function submitReview(productId) {
  const user = document.getElementById('revUser').value.trim();
  const rating = Number(document.getElementById('revRating').value);
  const comment = document.getElementById('revComment').value.trim();
  if (!user || !comment) return alert("نام و نظر الزامی است");

  let reviews = await loadReviews();
  if (!reviews[productId]) reviews[productId] = [];
  reviews[productId].push({ user, rating, comment });

  try {
    await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify({ reviews })
    });
    alert("نظر شما با موفقیت ثبت شد ✅");
    document.getElementById('revUser').value = '';
    document.getElementById('revRating').value = 5;
    document.getElementById('revComment').value = '';
    renderReviews(productId);
  } catch(err) {
    console.error(err);
    alert("خطا در ثبت نظر ❌");
  }
}

async function renderReviews(productId) {
  const reviewsData = await loadReviews();
  const productReviews = reviewsData[productId] || [];
  const container = document.getElementById('reviewsList');
  if (!container) return;
  container.innerHTML = '';
  if (productReviews.length === 0) {
    container.innerHTML = '<p>هنوز نظری ثبت نشده است</p>';
    return;
  }
  let totalRating = 0;
  productReviews.forEach(r => {
    totalRating += r.rating;
    const div = document.createElement('div');
    div.className = 'review-item';
    div.innerHTML = `<strong>${r.user}</strong> — ⭐ ${r.rating}<br>${r.comment}`;
    container.appendChild(div);
  });
  const avg = (totalRating / productReviews.length).toFixed(1);
  const avgDiv = document.createElement('div');
  avgDiv.style.margin = '12px 0';
  avgDiv.innerHTML = `<strong>میانگین امتیاز: ⭐${avg} از ${productReviews.length} نظر</strong>`;
  container.prepend(avgDiv);
}

// -------------------
// فیلتر ساده
// -------------------
function filterProducts(brand, category) {
  renderProducts({brand, category});
}

// -------------------
// شروع کار
// -------------------
loadProducts();
