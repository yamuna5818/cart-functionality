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
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <p class="p1">${product.name}</p>
      <p class="p2">$${product.price}</p>
      <button class="add" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productDiv.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  updateUI();
}

function changeQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateUI();
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
      <div class="cart-details">${item.name} - $${item.price}</div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
        <span class="qty-display">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  total.textContent = `Total: $${totalPrice}`;

  const existingCheckout = document.querySelector(".checkout-btn");
  if (!existingCheckout && totalPrice > 0) {
    const checkoutBtn = document.createElement("button");
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.classList.add("checkout-btn");
    checkoutBtn.onclick = goToCheckout;
    total.insertAdjacentElement("afterend", checkoutBtn);
  }
}

function renderCheckout() {
  const checkoutContainer = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");
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
          <button onclick="changeQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    checkoutContainer.appendChild(div);
  });

  totalEl.textContent = `Total: $${totalPrice}`;
}

function searchProducts() {
  const query = document.getElementById("search")?.value.toLowerCase();
  if (!query && query !== "") return;
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

function updateUI() {
  const isCheckoutPage = window.location.pathname.includes("checkout.html");
  if (isCheckoutPage) {
    renderCheckout();
  } else {
    renderCart();
  }
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
  }
};
