// ============================================================
// Renders the /cart page contents from localStorage + live book data
// ============================================================
async function renderCartPage() {
  const cart = getCart();
  const listEl = document.getElementById('cartList');
  const summaryEl = document.getElementById('cartSummary');
  const emptyEl = document.getElementById('cartEmpty');

  if (!cart.length) {
    listEl.innerHTML = '';
    summaryEl.style.display = 'none';
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';
  summaryEl.style.display = 'block';

  const ids = cart.map(i => i.bookId).join(',');
  const res = await fetch(`/api/books/lookup?ids=${ids}`);
  const { books } = await res.json();

  let subtotal = 0;
  let itemsHtml = '';

  cart.forEach(item => {
    const book = books.find(b => b.id === item.bookId);
    if (!book) return; // book deleted from catalogue
    const qty = Math.min(item.quantity, book.stock_quantity || item.quantity);
    const lineTotal = book.price * qty;
    subtotal += lineTotal;

    itemsHtml += `
      <div class="cart-item">
        <img src="${book.cover_image}" alt="${escapeHtml(book.title)}">
        <div>
          <h4><a href="/books/${book.id}">${escapeHtml(book.title)}</a></h4>
          <div class="muted">₹${Number(book.price).toFixed(2)} each · ${book.stock_quantity} in stock</div>
          <div class="qty-selector" style="margin-top:8px;">
            <button type="button" onclick="changeCartQty(${book.id}, -1)">−</button>
            <input type="text" value="${qty}" readonly>
            <button type="button" onclick="changeCartQty(${book.id}, 1)">+</button>
          </div>
        </div>
        <div class="line-price">₹${lineTotal.toFixed(2)}</div>
        <button class="remove-link" onclick="removeCartLine(${book.id})">Remove</button>
      </div>
    `;
  });

  listEl.innerHTML = itemsHtml || '<p class="muted">Some items in your cart are no longer available.</p>';

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  document.getElementById('sumSubtotal').textContent = `₹${subtotal.toFixed(2)}`;
  document.getElementById('sumShipping').textContent = shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`;
  document.getElementById('sumTotal').textContent = `₹${total.toFixed(2)}`;
}

function changeCartQty(bookId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.bookId === bookId);
  if (!item) return;
  setQuantity(bookId, item.quantity + delta);
  renderCartPage();
}

function removeCartLine(bookId) {
  removeFromCart(bookId);
  renderCartPage();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', renderCartPage);
