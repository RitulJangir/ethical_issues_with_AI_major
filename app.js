// Sample data
const suppliers = [
  { name: 'Acme Corp',    region: 'North America', lastUpdated: '2024-01-15', risk: 85 },
  { name: 'Global Industries', region: 'Europe',   lastUpdated: '2024-01-14', risk: 65 },
  { name: 'Pacific Trading',    region: 'Asia',     lastUpdated: '2024-01-13', risk: 92 },
];

function renderCards() {
  document.getElementById('total-suppliers').textContent = suppliers.length;
  document.getElementById('high-risk').textContent =
    suppliers.filter(s => s.risk >= 70).length;
  document.getElementById('new-alerts').textContent = Math.floor(Math.random()*10) + 1;
}

function renderTable(regionFilter = 'All Regions') {
  const tbody = document.getElementById('supplier-table');
  tbody.innerHTML = '';
  suppliers
    .filter(s => regionFilter === 'All Regions' || s.region === regionFilter)
    .forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.region}</td>
        <td>${s.lastUpdated}</td>
        <td class="${s.risk>=80?'red':(s.risk>=60?'orange':'green')}">${s.risk}</td>
        <td><button class="btn" onclick="alert('Viewing details for ${s.name}')">View Details</button></td>
      `;
      tbody.appendChild(tr);
    });
}

// Event listeners
document.getElementById('region-select').addEventListener('change', e => {
  renderTable(e.target.value);
});
document.getElementById('rerun-scan').addEventListener('click', () => {
  alert('Full scan triggered!');
  renderCards();
  renderTable(document.getElementById('region-select').value);
});

// Initial render
renderCards();
renderTable();
