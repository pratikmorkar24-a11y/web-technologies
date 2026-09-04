// ============================================================
// Inkwell — Shopping Cart (client-side, backed by localStorage)
// Cart shape: [{ bookId: Number, quantity: Number }]
// Checkout converts this into a real Order via POST /api/checkout
// ============================================================
const CART_KEY = 'inkwell_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(bookId, quantity = 1) {
  bookId = Number(bookId);
  const cart = getCart();
  const existing = cart.find(i => i.bookId === bookId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ bookId, quantity });
  }
  saveCart(cart);
  showToast('Added to cart 📚');
}

function setQuantity(bookId, quantity) {
  bookId = Number(bookId);
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(i => i.bookId !== bookId);
  } else {
    const existing = cart.find(i => i.bookId === bookId);
    if (existing) existing.quantity = quantity;
  }
  saveCart(cart);
}

function removeFromCart(bookId) {
  bookId = Number(bookId);
  const cart = getCart().filter(i => i.bookId !== bookId);
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
}

// ---- Tiny toast notification ----
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('inkwellToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'inkwellToast';
    toast.style.cssText = `
      position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; padding: 13px 26px;
      border-radius: 999px; font-size: 0.9rem; font-weight: 600; z-index: 1000; opacity: 0;
      box-shadow: 0 15px 40px -10px rgba(99,102,241,0.6); transition: opacity .3s ease, transform .3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  clearTimeout(toastTimer);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2200);
}

// ---- Wire up any "Add to cart" buttons on the page ----
function wireAddToCartButtons() {
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const stock = Number(btn.dataset.stock || 0);
      if (stock <= 0) return;
      const qtyInput = btn.closest('[data-qty-scope]')?.querySelector('[data-qty-input]');
      const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      addToCart(btn.dataset.addToCart, qty);
    });
  });

  // Quantity steppers (used on book details page)
  document.querySelectorAll('[data-qty-scope]').forEach(scope => {
    const input = scope.querySelector('[data-qty-input]');
    const max = Number(input?.dataset.max || 99);
    scope.querySelectorAll('[data-qty-step]').forEach(stepBtn => {
      stepBtn.addEventListener('click', () => {
        const step = Number(stepBtn.dataset.qtyStep);
        let val = parseInt(input.value, 10) || 1;
        val = Math.min(max, Math.max(1, val + step));
        input.value = val;
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  wireAddToCartButtons();
});
