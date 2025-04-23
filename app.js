// app.js

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const alertPanel    = document.getElementById('alert-panel');
  const alertButton   = document.getElementById('alert-button');
  const markAllRead   = document.getElementById('mark-all-read');
  const alertCount    = document.getElementById('alert-count');
  const alertList     = document.getElementById('alert-list');
  const btnDrill      = document.getElementById('btn-drill-alerts');
  const btnScan       = document.getElementById('btn-full-scan');
  const searchInput   = document.getElementById('supplier-search');
  const supplierTbody = document.getElementById('supplier-tbody');
  const sortButton    = document.getElementById('sort-button');
  let sortAsc = true;

  // 1. Toggle Alert Panel
  alertButton.addEventListener('click', () => {
    alertPanel.classList.toggle('visible');
  });
  btnDrill.addEventListener('click', () => {
    alertPanel.classList.add('visible');
  });

  // 2. Mark All Alerts as Read
  markAllRead.addEventListener('click', () => {
    alertList.innerHTML = '';
    alertCount.textContent = '0';
  });

  // 3. Dismiss or View Individual Alerts
  alertList.addEventListener('click', (e) => {
    const item = e.target.closest('.alert-item');
    if (!item) return;

    if (e.target.textContent === 'Dismiss') {
      item.remove();
      alertCount.textContent = alertList.querySelectorAll('.alert-item').length;
    }

    if (e.target.textContent === 'View Details') {
      const title = item.querySelector('.alert-title').textContent;
      alertPanel.classList.remove('visible');
      alert(`Navigating to details for alert: "${title}"`);
    }
  });

  // 4. Search Suppliers in Table
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    Array.from(supplierTbody.rows).forEach(row => {
      const name = row.cells[1].textContent.toLowerCase();
      row.style.display = name.includes(filter) ? '' : 'none';
    });
  });

  // 5. Sort Suppliers by Name
  sortButton.addEventListener('click', () => {
    const rows = Array.from(supplierTbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      const aName = a.cells[1].textContent.trim();
      const bName = b.cells[1].textContent.trim();
      return sortAsc 
        ? aName.localeCompare(bName) 
        : bName.localeCompare(aName);
    });
    sortAsc = !sortAsc;
    rows.forEach(r => supplierTbody.appendChild(r));
  });

  // 6. Re-run Full Scan (simulated)
  btnScan.addEventListener('click', () => {
    btnScan.disabled = true;
    btnScan.textContent = 'Scanning...';
    setTimeout(() => {
      btnScan.disabled = false;
      btnScan.textContent = 'Re-run Full Scan';
      alert('Full scan completed. Metrics updated.');
    }, 2000);
  });

  // 7. View Supplier Details from Table
  supplierTbody.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-detail')) {
      const name = e.target.closest('tr').cells[1].textContent;
      alert(`Navigating to details for "${name}"`);
    }
  });
});
