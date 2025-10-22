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
  renderCart();
}

function updateQty(id, value) {
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty = value > 0 ? parseInt(value) : 1;
    saveCart();
    renderCart();
  }
}

function renderCart() {
  const cartContainer = document.getElementById("cart-c");
  const total = document.getElementById("total");
  cartContainer.innerHTML = "";
  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.qty;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-details">${item.name} - $${item.price}</div>
      <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="updateQty(${item.id}, this.value)" />
      <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
    `;
    cartContainer.appendChild(div);
  });

  total.textContent = `Total: $${totalPrice}`;
}

function searchProducts() {
  const query = document.getElementById("search").value.toLowerCase();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );
  displayProducts(filtered);
}

const cartToggleBtn = document.getElementById("cart-toggle-btn");
const cartEl = document.getElementById("cart");

if (cartToggleBtn && cartEl) {
  cartToggleBtn.addEventListener("click", () => {
    cartEl.classList.toggle("active");
  });
}

window.onload = function () {
  displayProducts();
  renderCart();
};
