/* ============================================================
   SILVARA — Main JS
   Cart state, scroll effects, animations
   ============================================================ */

// ===== STATE =====
let cart = [];
let cartOpen = false;
let mobileOpen = false;

// ===== CART =====
function toggleCart() {
  cartOpen = !cartOpen;
  document.getElementById('cart-overlay').classList.toggle('open', cartOpen);
  document.getElementById('cart-sidebar').classList.toggle('open', cartOpen);
  document.body.style.overflow = cartOpen ? 'hidden' : '';
}

function addToCart(btn) {
  const card  = btn.closest('[data-product]');
  const name  = card.dataset.product;
  const price = parseInt(card.dataset.price, 10);

  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  renderCart();
  if (!cartOpen) toggleCart();
}

function updateQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  renderCart();
}

function renderCart() {
  const body  = document.getElementById('cart-body');
  const foot  = document.getElementById('cart-foot');
  const empty = document.getElementById('cart-empty');
  const badge = document.getElementById('cart-badge');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  // Badge
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';

  if (cart.length === 0) {
    empty.style.display  = 'flex';
    foot.style.display   = 'none';
    body.querySelectorAll('.cart-item').forEach(el => el.remove());
    return;
  }

  empty.style.display = 'none';
  foot.style.display  = 'block';

  // Re-render items
  body.querySelectorAll('.cart-item').forEach(el => el.remove());
  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-thumb" style="background:linear-gradient(135deg,#ede4d4,#d4c9b4)"></div>
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">14K Gold Plated · 18"</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty('${item.name}', -1)">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn" onclick="updateQty('${item.name}', 1)">+</button>
        </div>
      </div>
      <div class="cart-item-price">$${item.price * item.qty}</div>
    `;
    body.appendChild(el);
  });

  document.getElementById('cart-sub').textContent   = `$${total}`;
  document.getElementById('cart-total').textContent = `$${total}`;
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
  mobileOpen = !mobileOpen;
  document.getElementById('mobile-menu').classList.toggle('open', mobileOpen);
  document.body.style.overflow = mobileOpen ? 'hidden' : '';
}

// ===== NAV SCROLL SHADOW =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

// ===== SCROLL REVEAL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== NEWSLETTER =====
function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.newsletter-btn');
  const orig = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.style.cssText = 'background:#3a7a3a;border-color:#3a7a3a';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.cssText = '';
    e.target.reset();
  }, 3200);
}

// Wire up newsletter form
document.querySelector('.newsletter-form')?.addEventListener('submit', handleNewsletter);

// ===== INIT =====
renderCart();
