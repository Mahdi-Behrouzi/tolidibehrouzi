const binUrl = "https://api.jsonbin.io/v3/b/68e50c67d0ea881f40986859";
const apiKey = "BAz3UXrj2Hs4CTSu9Sx.SORA0uPP1H62lvU/gZsySq7/iEzRRnAVe";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch(binUrl, {
  headers: { "X-Master-Key": apiKey }
})
  .then(res => res.json())
  .then(data => {
    products = data.record;
    renderProducts(products);
    renderCategories(products);
    renderCart();
  });

function renderProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.title}" />
        <h3>${p.title}</h3>
        <p>${p.price} تومان</p>
        <button onclick="addToCart(${p.id})">افزودن به سبد</button>
      </div>
    `;
  });
}

function renderCategories(list) {
  const categories = [...new Set(list.map(p => p.category))];
  const select = document.getElementById("category-filter");
  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function addToCart(id) {
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
ea881f40986859";
const apiKey = "BAz3UXrj2Hs4CTSu9Sx.SORA0uPP1H62lvU/gZsySq7/iEzRRnAVe";

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

fetch(binUrl, {
  headers: { "X-Master-Key": apiKey }
})
  .then(res => res.json())
  .then(data => {
    products = data.record;
    renderProducts(products);
    renderCategories(products);
    renderCart();
  });

function renderProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";
  list.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.image}" alt="${p.title}" />
        <h3>${p.title}</h3>
        <p>${p.price} تومان</p>
        <button onclick="addToCart(${p.id})">افزودن به سبد</button>
      </div>
    `;
  });
}

function renderCategories(list) {
  const categories = [...new Set(list.map(p => p.category))];
  const select = document.getElementById("category-filter");
  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function addToCart(id) {
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  cartList.innerHTML = "";
  let sum = 0;
  cart.forEach(id => {
    const item = products.find(p => p.id === id);
    if (item) {
      cartList.innerHTML += `<li>${item.title} - ${item.price} تومان</li>`;
      sum += parseInt(item.price.replace(/,/g, ""));
    }
  });
  total.textContent = `جمع کل: ${sum.toLocaleString()} تومان`;
}

document.getElementById("search").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(keyword));
  renderProducts(filtered);
});

document.getElementById("category-filter").addEventListener("change", e => {
  const cat = e.target.value;
  const filtered = cat ? products.filter(p => p.category === cat) : products;
  renderProducts(filtered);
});
