// ============================================================
// Handles the checkout form: renders order summary + submits order
// ============================================================
async function renderCheckoutSummary() {
  const cart = getCart();
  const summaryEl = document.getElementById('checkoutSummary');
  const submitBtn = document.getElementById('placeOrderBtn');

  if (!cart.length) {
    summaryEl.innerHTML = '<p class="muted">Your cart is empty. <a href="/catalogue" style="color:var(--cyan-400)">Browse the catalogue</a>.</p>';
    submitBtn.disabled = true;
    return;
  }

  const ids = cart.map(i => i.bookId).join(',');
  const res = await fetch(`/api/books/lookup?ids=${ids}`);
  const { books } = await res.json();

  let subtotal = 0;
  let rows = '';
  cart.forEach(item => {
    const book = books.find(b => b.id === item.bookId);
    if (!book) return;
    const lineTotal = book.price * item.quantity;
    subtotal += lineTotal;
    rows += `<div class="summary-row"><span>${item.quantity} × ${book.title}</span><span>₹${lineTotal.toFixed(2)}</span></div>`;
  });

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  summaryEl.innerHTML = `
    ${rows}
    <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '₹' + shipping.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Total</span><span class="amt">₹${total.toFixed(2)}</span></div>
  `;
}

async function submitOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('placeOrderBtn');
  const errorEl = document.getElementById('checkoutError');
  errorEl.style.display = 'none';

  const cart = getCart();
  if (!cart.length) return;

  const address = document.getElementById('shippingAddress').value.trim();
  if (!address) {
    errorEl.textContent = 'Please enter a shipping address.';
    errorEl.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Placing order…';

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(i => ({ bookId: i.bookId, quantity: i.quantity })),
        shippingAddress: address
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Checkout failed.');

    clearCart();
    window.location.href = `/dashboard?ordered=${data.orderId}`;
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  const form = document.getElementById('checkoutForm');
  if (form) form.addEventListener('submit', submitOrder);
});
