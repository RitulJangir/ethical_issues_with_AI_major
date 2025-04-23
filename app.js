document.addEventListener('DOMContentLoaded', () => {
  const alertPanel    = document.getElementById('alert-panel');
  const alertButton   = document.getElementById('alert-button');
  const markAllRead   = document.getElementById('mark-all-read');
  const alertCount    = document.getElementById('alert-count');
  const alertList     = document.getElementById('alert-list');
  const scanBtn       = document.getElementById('scan-btn');
  const searchInput   = document.getElementById('supplier-search');
  const supplierTbody = document.getElementById('supplier-tbody');
  const sortButton    = document.getElementById('sort-button');
  let sortAsc = true;

  // Toggle Alert Panel
  alertButton.addEventListener('click', () => alertPanel.classList.toggle('visible'));

  // Mark all as read
  markAllRead.addEventListener('click', () => {
    alertList.innerHTML = '';
    alertCount.textContent = '0';
  });

  // Dismiss or view detail
  alertList.addEventListener('click', e => {
    const item = e.target.closest('.alert-item'); if (!item) return;
    if (e.target.textContent === 'Dismiss') {
      item.remove(); alertCount.textContent = alertList.querySelectorAll('.alert-item').length;
    }
    if (e.target.textContent === 'View Details') {
      const title = item.querySelector('.alert-title').textContent;
      alertPanel.classList.remove('visible'); alert(`Navigating to details for alert: "${title}"`);
    }
  });

  // Search suppliers
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();
    Array.from(supplierTbody.rows).forEach(row => {
      row.style.display = row.cells[1].textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
  });

  // Sort suppliers
  sortButton.addEventListener('click', () => {
    const rows = Array.from(supplierTbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      const aName = a.cells[1].textContent.trim();
      const bName = b.cells[1].textContent.trim();
      return sortAsc ? aName.localeCompare(bName) : bName.localeCompare(aName);
    }); sortAsc = !sortAsc; rows.forEach(r => supplierTbody.appendChild(r));
  });

  // Re-run full scan
  scanBtn.addEventListener('click', () => {
    scanBtn.disabled = true; scanBtn.textContent = 'Scanning...';
    setTimeout(() => { scanBtn.disabled = false; scanBtn.textContent = 'Re-run Full Scan'; alert('Full scan completed. Metrics updated.'); }, 2000);
  });
});
