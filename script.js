const products = [
  { id: 1, name: "Hertfoid Upholstered Chair", price: 101, image: "images/1.png" },
  { id: 2, name: "Abingdon Upholstered Chair Swivel", price: 151, image: "images/2.png" },
  { id: 3, name: "Jeses Minimore Modern Style Etta", price: 181, image: "images/3.png" },
  { id: 4, name: "JJeses Minimore Modern Style", price: 201, image: "images/4.png" },
  { id: 5, name: "Bolanle Upholstered Armchair", price: 251, image: "images/5.png" },
  { id: 6, name: "Jaqueze Upholstered Armchair", price: 111, image: "images/6.png" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayProducts(list = products) {
  const productDiv = document.getElementById("products");
  if (!productDiv) return;
  productDiv.innerHTML = "";

  list.forEach((product) => {
    const inCart = cart.find((item) => item.id === product.id);
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <p class="p1">${product.name}</p>
      <p class="p2">$${product.price}</p>
      ${
        inCart
          ? `
          <button class="add" onclick="openCart()">Go to Cart</button>
        `
          : `<button class="add" onclick="addToCart(${product.id})">Add to Cart</button>`
      }
    `;
    productDiv.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateUI();
  updateCartCounter();
  displayProducts(); 

  openCart();
}

function openCart() {
  const cartEl = document.getElementById("cart");
  if (cartEl) cartEl.classList.add("active");
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateUI();
  updateCartCounter();
  displayProducts();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else {
      saveCart();
      updateUI();
      updateCartCounter();
      displayProducts();
    }
  }
}

function renderCart() {
  const cartContainer = document.getElementById("cart-c");
  const total = document.getElementById("total");
  if (!cartContainer || !total) return;

  cartContainer.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="checkout-details">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
        <div class="checkout-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  total.textContent = `Total: $${totalPrice}`;
}

function renderCheckout() {
  const checkoutContainer = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
  const formEl = document.getElementById("checkout-form");

  if (!checkoutContainer || !totalEl) return;
  checkoutContainer.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    checkoutContainer.innerHTML = "<p>Your cart is empty!</p>";
    totalEl.textContent = "Total: $0";
    return;
  }

  cart.forEach((item) => {
    totalPrice += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("checkout-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="checkout-details">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
        <div class="checkout-qty">
          <button onclick="changeQty(${item.id}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    checkoutContainer.appendChild(div);
  });

  totalEl.textContent = `Total: $${totalPrice}`;

  if (formEl) {
    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      alert("🎉 Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    });
  }
}

function updateUI() {
  const isCheckoutPage = window.location.pathname.includes("checkout.html");
  if (isCheckoutPage) renderCheckout();
  else renderCart();
}

function updateCartCounter() {
  const counter = document.getElementById("cart-counter");
  if (!counter) return;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  counter.textContent = totalItems;
}

function searchProducts() {
  const query = document.getElementById("search")?.value.toLowerCase();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
  displayProducts(filtered);
}

function goToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  window.location.href = "checkout.html";
}

const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartEl = document.getElementById("cart");

if (cartToggleBtn && cartEl) {
  cartToggleBtn.addEventListener("click", () => {
    cartEl.classList.toggle("active");
  });
}

window.onload = function () {
  const isCheckoutPage = window.location.pathname.includes("checkout.html");
  if (isCheckoutPage) {
    renderCheckout();
  } else {
    displayProducts();
    renderCart();
    updateCartCounter();
  }
};
