const products = [
  {id:1,name:"سرکلیدی بافتنی",category:"سرکلیدی",parent:"بافتنی",price:85000,emoji:"🧶",desc:"یک سرکلیدی دست‌بافت کوچک و دوست‌داشتنی."},
  {id:2,name:"عروسک بافتنی",category:"عروسک",parent:"بافتنی",price:180000,emoji:"🧸",desc:"عروسک دست‌بافت؛ مناسب هدیه و دکور."},
  {id:3,name:"گیرسر بافتنی",category:"گیرسر",parent:"بافتنی",price:75000,emoji:"🎀",desc:"اکسسوری بافتنی برای مو با طراحی ساده."},
  {id:4,name:"سرکلیدی طرح قورباغه",category:"سرکلیدی",parent:"بافتنی",price:120000,emoji:"🐸",desc:"آویز کوچک و بامزه‌ی دست‌بافت."},
  {id:5,name:"گردنبند دستساز",category:"گردنبند",parent:"اکسسوری",price:155000,emoji:"📿",desc:"گردنبند دستساز با جزئیات ظریف."},
  {id:6,name:"دستبند دستساز",category:"دستبند",parent:"اکسسوری",price:95000,emoji:"♡",desc:"دستبند سبک و مینیمال برای استفاده روزمره."},
  {id:7,name:"آویز موبایل",category:"آویز موبایل",parent:"اکسسوری",price:85000,emoji:"📱",desc:"آویز دستساز برای شخصی‌تر کردن گوشی."},
  {id:8,name:"آویز شانسی",category:"آویز موبایل",parent:"اکسسوری",price:35000,emoji:"✨",desc:"یک آویز کوچک و شانسی؛ طرح آن غافلگیرت می‌کند."}
];

let cart = JSON.parse(localStorage.getItem("aartybit-cart") || "[]");

const fa = n => Number(n).toLocaleString("fa-IR");
const grid = document.getElementById("productGrid");
const filters = document.getElementById("filters");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const checkoutModal = document.getElementById("checkoutModal");

function renderProducts(filter="همه") {
  const list = filter === "همه" ? products : products.filter(p => p.category === filter || p.parent === filter);
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image" aria-label="${p.name}">${p.emoji}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-meta">
          <span class="price">${fa(p.price)} تومان</span>
          <button class="add-btn" data-add="${p.id}">افزودن</button>
        </div>
      </div>
    </article>
  `).join("");
}

function saveCart() {
  localStorage.setItem("aartybit-cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = fa(count);

  const items = document.getElementById("cartItems");
  if (!cart.length) {
    items.innerHTML = `<div class="empty">سبد خریدت هنوز خالیه 🌱<br><br><a href="#shop" class="primary-btn" onclick="closeCart()">رفتن به فروشگاه</a></div>`;
  } else {
    items.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="cart-thumb">${i.emoji}</div>
        <div>
          <h4>${i.name}</h4>
          <small>${fa(i.price)} تومان</small>
          <div class="qty">
            <button data-minus="${i.id}">−</button>
            <span>${fa(i.qty)}</span>
            <button data-plus="${i.id}">+</button>
          </div>
        </div>
        <button class="remove" data-remove="${i.id}">حذف</button>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartTotal").textContent = `${fa(total)} تومان`;
}

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("open");
}
function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("open");
}
window.closeCart = closeCart;

function addToCart(id) {
  const p = products.find(x => x.id === id);
  const found = cart.find(x => x.id === id);
  if (found) found.qty++;
  else cart.push({...p, qty:1});
  saveCart();
  openCart();
}

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) addToCart(Number(add.dataset.add));

  const plus = e.target.closest("[data-plus]");
  if (plus) {
    const item = cart.find(x => x.id === Number(plus.dataset.plus));
    if (item) item.qty++;
    saveCart();
  }

  const minus = e.target.closest("[data-minus]");
  if (minus) {
    const item = cart.find(x => x.id === Number(minus.dataset.minus));
    if (item) item.qty--;
    cart = cart.filter(x => x.qty > 0);
    saveCart();
  }

  const remove = e.target.closest("[data-remove]");
  if (remove) {
    cart = cart.filter(x => x.id !== Number(remove.dataset.remove));
    saveCart();
  }
});

filters.addEventListener("click", e => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts(btn.dataset.filter);
});

document.querySelectorAll(".category-card").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.toggle("active", b.dataset.filter === btn.dataset.filter));
    renderProducts(btn.dataset.filter);
    document.getElementById("shop").scrollIntoView({behavior:"smooth"});
  });
});

document.getElementById("openCart").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
overlay.onclick = closeCart;

document.getElementById("clearCart").onclick = () => {
  cart = [];
  saveCart();
};

document.getElementById("checkoutBtn").onclick = () => {
  if (!cart.length) return;
  const preview = document.getElementById("orderPreview");
  preview.innerHTML = `<strong>خلاصه سفارش</strong><br>` +
    cart.map(i => `${i.name} × ${fa(i.qty)} — ${fa(i.price*i.qty)} تومان`).join("<br>") +
    `<hr><strong>جمع: ${fa(cart.reduce((s,i)=>s+i.price*i.qty,0))} تومان</strong>`;
  checkoutModal.classList.add("open");
  closeCart();
};

document.getElementById("closeCheckout").onclick = () => checkoutModal.classList.remove("open");

document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const order = {
    code: "AB-" + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    customer: data,
    items: cart
  };
  localStorage.setItem("aartybit-last-order", JSON.stringify(order));
  document.getElementById("checkoutForm").hidden = true;
  document.querySelector(".modal-note").hidden = true;
  document.getElementById("successState").hidden = false;
  cart = [];
  saveCart();
});

document.getElementById("backToShop").onclick = () => {
  checkoutModal.classList.remove("open");
  document.getElementById("checkoutForm").hidden = false;
  document.querySelector(".modal-note").hidden = false;
  document.getElementById("successState").hidden = true;
  window.location.hash = "#shop";
};

renderProducts();
renderCart();
