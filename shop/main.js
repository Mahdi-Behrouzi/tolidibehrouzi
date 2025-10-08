const binUrl = "https://api.jsonbin.io/v3/b/68e50c67d0ea881f40986859";
const apiKey = "BAz3UXrj2Hs4CTSu9Sx.SORA0uPP1H62lvU/gZsySq7/iEzRRnAVe";

fetch(binUrl, {
  headers: {
    "X-Master-Key": apiKey
  }
})
  .then(res => res.json())
  .then(data => {
    const products = data.record;
    const container = document.getElementById("products");
    products.forEach(p => {
      container.innerHTML += `
        <div class="product-card">
          <img src="${p.image}" alt="${p.title}" />
          <h3>${p.title}</h3>
          <p>${p.price} تومان</p>
          <button onclick="addToCart(${p.id})">افزودن به سبد</button>
        </div>
      `;
    });
  });

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push(id);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("محصول به سبد خرید اضافه شد!");
}
