(function() {
  const itemRowsContainer = document.getElementById('itemRows');
  const addItemButton = document.getElementById('addItem');
  const grandTotalInput = document.getElementById('grandTotal');
  const printBtn = document.getElementById('printBtn');

  const pDate = document.getElementById('pDate');
  const pInvoice = document.getElementById('pInvoice');
  const pCustomer = document.getElementById('pCustomer');
  const pCustomerNo = document.getElementById('pCustomerNo');
  const pItems = document.getElementById('pItems');
  const pGrand = document.getElementById('pGrand');

  const orderDate = document.getElementById('orderDate');
  const invoiceNumber = document.getElementById('invoiceNumber');
  const customerName = document.getElementById('customerName');
  const customerNumber = document.getElementById('customerNumber');

  function createItemRow(defaults = {}) {
    const row = document.createElement('div');
    row.className = 'item-row';

    const name = document.createElement('input');
    name.type = 'text';
    name.placeholder = 'Item name';
    name.value = defaults.name || '';

    const qty = document.createElement('input');
    qty.type = 'number';
    qty.min = '0';
    qty.step = '1';
    qty.placeholder = '0';
    qty.value = defaults.qty != null ? String(defaults.qty) : '';

    const price = document.createElement('input');
    price.type = 'number';
    price.min = '0';
    price.step = '1';
    // price.placeholder = '0.00';
    price.placeholder = '00';
    price.value = defaults.price != null ? String(defaults.price) : '';

    const total = document.createElement('input');
    total.type = 'text';
    total.className = 'row-total';
    total.readOnly = true;
    // total.placeholder = '0.00';
    total.placeholder = '00';

    [name, qty, price].forEach(el => {
      el.addEventListener('input', () => {
        updateTotals();
      });
    });

    row.appendChild(name);
    row.appendChild(qty);
    row.appendChild(price);
    row.appendChild(total);

    return row;
  }

  function readItems() {
    const rows = Array.from(itemRowsContainer.querySelectorAll('.item-row'));
    return rows.map(r => {
      const [nameEl, qtyEl, priceEl] = r.querySelectorAll('input');
      const qty = parseInt(qtyEl.value || '0', 10);
      const price = parseInt(priceEl.value || '0', 10);
      const total = qty * price;
      return {
        name: nameEl.value || '',
        qty: Number.isFinite(qty) ? qty : 0,
        price: Number.isFinite(price) ? price : 0,
        total: Number.isFinite(total) ? total : 0
      };
    });
  }

  function updateTotals() {
    const items = readItems();

    // update per-row totals
    Array.from(itemRowsContainer.querySelectorAll('.item-row')).forEach((r, idx) => {
      const totalEl = r.querySelector('input.row-total');
      totalEl.value = String(items[idx].total);
    });

    const grand = items.reduce((sum, it) => sum + it.total, 0);
    grandTotalInput.value = String(grand);

    // update preview
    pItems.innerHTML = '';
    items.forEach(it => {
      if (!it.name && it.qty === 0 && it.price === 0) return;
      const row = document.createElement('div');
      row.className = 'row';
      row.innerHTML = `
        <div>${escapeHtml(it.name)}</div>
        <div>${formatQty(it.qty)}</div>
        <div>${it.price}</div>
        <div>${it.total}</div>
      `;
      pItems.appendChild(row);
    });
    pGrand.textContent = String(grand);

    // update meta
    pDate.textContent = orderDate.value || '-';
    pInvoice.textContent = invoiceNumber.value || '-';
    pCustomer.textContent = customerName.value || '-';
    pCustomerNo.textContent = customerNumber.value || '-';
  }

  function formatQty(q) {
    return String(parseInt(q, 10) || 0);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function addBlankRow() {
    itemRowsContainer.appendChild(createItemRow());
    updateTotals();
  }

  // Wire up inputs to live preview
  [orderDate, invoiceNumber, customerName, customerNumber].forEach(el => {
    el.addEventListener('input', updateTotals);
    el.addEventListener('change', updateTotals);
  });

  addItemButton.addEventListener('click', addBlankRow);

  printBtn.addEventListener('click', () => {
    // Ensure totals are current before printing
    updateTotals();
    window.print();
  });

  // Initialize with one item row
  addBlankRow();
})();

