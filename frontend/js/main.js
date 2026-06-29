const API = "https://ecommercefullstackwebsite-production.up.railway.app/api";
const BACKEND_URL = "https://ecommercefullstackwebsite-production.up.railway.app";


img.src = `${BACKEND_URL}/${product.image}`;
 
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('sv_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
 
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
 
export function getUser() {
  try {
    const u = localStorage.getItem('sv_user');
    return u ? JSON.parse(u) : null;
  } catch {
    localStorage.removeItem('sv_user');
    return null;
  }
}
 
export function isLoggedIn() { return !!localStorage.getItem('sv_token'); }
 
export function isAdmin() {
  const u = getUser();
  return u && u.role === 'admin';
}
 
export function logout() {
  localStorage.removeItem('sv_token');
  localStorage.removeItem('sv_user');
  window.location.href = '/index.html';
}
 
export function getCart() {
  try {
    const c = localStorage.getItem('sv_cart');
    return c ? JSON.parse(c) : [];
  } catch {
    localStorage.removeItem('sv_cart');
    return [];
  }
}
 
export function saveCart(cart) {
  localStorage.setItem('sv_cart', JSON.stringify(cart));
  updateCartBadge();
}
 
export function addToCart(product, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex(i => i._id === product._id);
  if (idx > -1) {
    cart[idx].qty = Math.min(cart[idx].qty + qty, product.stock || 99);
  } else {
    cart.push({ ...product, qty });
  }
  saveCart(cart);
  showToast(`"${product.name}" added to cart!`, 'success');
}
 
export function removeFromCart(id) {
  saveCart(getCart().filter(i => i._id !== id));
}
 
export function clearCart() { saveCart([]); }
 
export function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
 
export function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}
 
export function showToast(msg, type = '') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
 
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
}
 
export function formatPrice(p) {
  return 'Rs. ' + Number(p).toLocaleString('en-PK');
}
 
export function renderStars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
 
export function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count');
  const count = cartCount();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}
 
export function injectNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
 
  const user = getUser();
  const page = window.location.pathname.split('/').pop() || 'index.html';
 
  const userHtml = isLoggedIn() ? `
    <div class="nav-user">
      <button class="user-btn" onclick="window.toggleDropdown()">
        👤 ${user?.name?.split(' ')[0] || 'User'} ▾
      </button>
      <div class="dropdown hidden" id="userDropdown">
        ${isAdmin() ? `<a href="/pages/admin.html">⚙️ Admin Panel</a><div class="dropdown-divider"></div>` : ''}
        <button onclick="window.logout()">🚪 Logout</button>
      </div>
    </div>
  ` : `
    <button class="btn btn-primary btn-sm" onclick="window.openAuthModal()">Login</button>
  `;
 
  nav.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="/index.html" class="nav-logo">Shop<span>Verse</span></a>
        <div class="nav-search">
          <span class="search-icon">🔍</span>
          <input type="text" id="globalSearch" placeholder="Search products..."
                 onkeyup="window.handleGlobalSearch(event)" />
        </div>
        <div class="nav-links">
          <a href="/index.html" class="${page === 'index.html' ? 'active' : ''}">Home</a>
          <a href="/pages/products.html" class="${page === 'products.html' ? 'active' : ''}">Products</a>
          <a href="/pages/cart.html" class="${page === 'cart.html' ? 'active' : ''}">
            <button class="cart-btn">
              🛒 <span class="cart-count" style="display:none">0</span>
            </button>
          </a>
        </div>
        ${userHtml}
      </div>
    </nav>
  `;
  updateCartBadge();
}
 
export function toggleDropdown() {
  document.getElementById('userDropdown')?.classList.toggle('hidden');
}
 
export function handleGlobalSearch(e) {
  if (e.key === 'Enter') {
    const q = document.getElementById('globalSearch')?.value.trim();
    if (q) window.location.href = `/pages/products.html?search=${encodeURIComponent(q)}`;
  }
}
 
export function openAuthModal(mode = 'login') {
  const existing = document.getElementById('authModal');
  if (existing) existing.remove();
 
  document.body.insertAdjacentHTML('beforeend', `
    <div class="modal-overlay" id="authModal" onclick="window.closeModalOnBg(event)">
      <div class="modal">
        <button class="modal-close" onclick="window.closeAuthModal()">×</button>
        <div id="authContent"></div>
      </div>
    </div>
  `);
  renderAuthForm(mode);
}
 
export function closeAuthModal() {
  document.getElementById('authModal')?.remove();
}
 
export function closeModalOnBg(e) {
  if (e.target.id === 'authModal') closeAuthModal();
}
 
export function renderAuthForm(mode) {
  const content = document.getElementById('authContent');
  if (!content) return;
 
  if (mode === 'login') {
    content.innerHTML = `
      <h2>Welcome back 👋</h2>
      <p>Sign in to your ShopVerse account.</p>
      <div id="authErr" class="form-error hidden"></div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="loginEmail" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="loginPwd" placeholder="••••••••" />
      </div>
      <button class="btn btn-primary btn-block" onclick="window.handleLogin()">Sign In</button>
      <p class="auth-switch">No account? <a onclick="window.renderAuthForm('signup')">Create one →</a></p>
    `;
  } else {
    content.innerHTML = `
      <h2>Create account</h2>
      <p>Join ShopVerse today.</p>
      <div id="authErr" class="form-error hidden"></div>
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" id="signupName" placeholder="Your Name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" id="signupEmail" placeholder="you@example.com" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" id="signupPwd" placeholder="Min 6 characters" />
      </div>
      <button class="btn btn-primary btn-block" onclick="window.handleSignup()">Create Account</button>
      <p class="auth-switch">Already have an account? <a onclick="window.renderAuthForm('login')">Sign in →</a></p>
    `;
  }
}
 
export async function handleLogin() {
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPwd')?.value;
  const errEl = document.getElementById('authErr');
 
  if (!email || !password) {
    if (errEl) { errEl.textContent = 'Please fill in all fields.'; errEl.classList.remove('hidden'); }
    return;
  }
 
  try {
    const data = await apiFetch('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    });
    localStorage.setItem('sv_token', data.token);
    localStorage.setItem('sv_user', JSON.stringify(data.user));
    closeAuthModal();
    showToast(`Welcome back, ${data.user.name}! 🎉`, 'success');
    setTimeout(() => window.location.reload(), 500);
  } catch (err) {
    if (errEl) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
  }
}
 
export async function handleSignup() {
  const name = document.getElementById('signupName')?.value;
  const email = document.getElementById('signupEmail')?.value;
  const password = document.getElementById('signupPwd')?.value;
  const errEl = document.getElementById('authErr');
 
  if (!name || !email || !password) {
    if (errEl) { errEl.textContent = 'Please fill in all fields.'; errEl.classList.remove('hidden'); }
    return;
  }
 
  if (password.length < 6) {
    if (errEl) { errEl.textContent = 'Password must be at least 6 characters.'; errEl.classList.remove('hidden'); }
    return;
  }
 
  try {
    const data = await apiFetch('/auth/signup', {
      method: 'POST', body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem('sv_token', data.token);
    localStorage.setItem('sv_user', JSON.stringify(data.user));
    closeAuthModal();
    showToast(`Account created! Welcome, ${data.user.name} 🎉`, 'success');
    setTimeout(() => window.location.reload(), 500);
  } catch (err) {
    if (errEl) { errEl.textContent = err.message; errEl.classList.remove('hidden'); }
  }
}
 
const imgSrc = p.image
  ? (p.image.startsWith("http") ? p.image : `${BACKEND_URL}/${p.image}`)
  : "https://via.placeholder.com/400x300?text=No+Image";
  return `
    <div class="product-card">
      <div class="card-img">
        <img src="${imgSrc}" alt="${p.name}" loading="lazy"
             onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'" />
        ${p.featured ? '<span class="badge badge-accent featured-tag">⭐ Featured</span>' : ''}
        ${outOfStock ? '<div class="out-of-stock-overlay">Out of Stock</div>' : ''}
      </div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-title">
          <a href="/pages/product-detail.html?id=${p._id}">${p.name}</a>
        </div>
        <div class="card-desc">${p.description}</div>
        <div class="card-stars">
          <span class="stars">${renderStars(p.rating)}</span>
          <small>(${p.numReviews})</small>
        </div>
        <div class="card-footer">
          <div class="card-price">${formatPrice(p.price)}<br><small>PKR</small></div>
          <button
            class="btn btn-primary btn-sm"
            onclick='window.addToCart(${JSON.stringify(p).replace(/'/g, "&#39;")})'
            ${outOfStock ? 'disabled style="opacity:.5;cursor:not-allowed"' : ''}>
            🛒 Add
          </button>
        </div>
      </div>
    </div>
  `;

 
document.addEventListener('DOMContentLoaded', injectNavbar);
 
window.toggleDropdown = toggleDropdown;
window.handleGlobalSearch = handleGlobalSearch;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.closeModalOnBg = closeModalOnBg;
window.renderAuthForm = renderAuthForm;
window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.logout = logout;
window.addToCart = addToCart;
window.formatPrice = formatPrice;
window.renderStars = renderStars;
window.updateCartBadge = updateCartBadge;