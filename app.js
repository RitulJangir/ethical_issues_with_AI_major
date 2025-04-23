// app.js
document.addEventListener('DOMContentLoaded', () => {
  // ── Sample supplier data ───────────────────────────────────────────────
  const suppliers = [
    { name: 'Acme Corp',         region: 'North America', updated: '2024-01-15', risk: 85 },
    { name: 'Global Industries', region: 'Europe',        updated: '2024-01-14', risk: 65 },
    { name: 'Pacific Trading',   region: 'Asia',          updated: '2024-01-13', risk: 92 },
    // …you can replace or extend this array with real data…
  ];

  let sortKey = null, sortDir = 1; // 1 = asc, -1 = desc

  // ── Grab all the elements ────────────────────────────────────────────────
  const totalEl      = document.getElementById('total-suppliers');
  const highRiskEl   = document.getElementById('high-risk');
  const newAlertsEl  = document.getElementById('new-alerts');
  const regionSelect = document.getElementById('region-select');
  const searchInput  = document.getElementById('supplier-search');
  const riskFilter   = document.getElementById('risk-filter');
  const tableBody    = document.querySelector('#supplier-table tbody');
  const rerunBtn     = document.getElementById('rerun-scan');
  const themeToggle  = document.getElementById('theme-toggle');
  const headers      = document.querySelectorAll('#supplier-table thead th[data-sort-key]');

  // ── KPI Updater ─────────────────────────────────────────────────────────
  function updateKPIs() {
    totalEl.textContent     = suppliers.length;
    highRiskEl.textContent  = suppliers.filter(s => s.risk >= 80).length;
    newAlertsEl.textContent = Math.floor(Math.random()*10) + 1;
  }

  // ── Core Filter + Sort ───────────────────────────────────────────────────
  function getFilteredSorted() {
    let data = suppliers.slice();

    // region
    if (regionSelect.value !== 'All Regions') {
      data = data.filter(s => s.region === regionSelect.value);
    }
    // name search
    const term = searchInput.value.toLowerCase();
    if (term) data = data.filter(s => s.name.toLowerCase().includes(term));

    // risk band
    const rf = riskFilter.value;
    if (rf==='low')    data = data.filter(s=>s.risk<60);
    if (rf==='medium') data = data.filter(s=>s.risk>=60 && s.risk<80);
    if (rf==='high')   data = data.filter(s=>s.risk>=80);

    // sort
    if (sortKey) {
      data.sort((a,b) => {
        let aV = a[sortKey], bV = b[sortKey];
        if (sortKey==='updated') {
          aV = new Date(aV); bV = new Date(bV);
        }
        return sortDir * (aV > bV ? 1 : (aV < bV ? -1 : 0));
      });
    }
    return data;
  }

  // ── Sparkline Generator ─────────────────────────────────────────────────
  function generateSparkline(arr) {
    const w=50,h=16;
    const max=Math.max(...arr), min=Math.min(...arr);
    const pts = arr.map((v,i) => {
      const x = (i/(arr.length-1))*(w-2)+1;
      const y = h - ((v-min)/(max-min)*(h-2)+1);
      return `${x},${y}`;
    }).join(' ');
    return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
              <polyline fill="none" stroke="currentColor" stroke-width="1" points="${pts}"/>
            </svg>`;
  }

  // ── Table Renderer ───────────────────────────────────────────────────────
  function renderTable() {
    tableBody.innerHTML = '';
    getFilteredSorted().forEach(s => {
      // random mini‐trend around risk
      const trend = Array.from({length:7},
        ()=> Math.max(0, Math.min(100, s.risk + (Math.random()*20 -10)))
      );
      const spark = generateSparkline(trend);

      const tr = document.createElement('tr');
      const cls = s.risk >=80 ? 'danger'
                : s.risk >=60 ? 'warning'
                              : 'primary';

      tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.region}</td>
        <td>${s.updated}</td>
        <td class="${cls}">${s.risk}</td>
        <td><span class="sparkline">${spark}</span></td>
        <td><button class="btn" onclick="alert('Viewing ${s.name}')">View Details</button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // ── Event Hooks ──────────────────────────────────────────────────────────
  // Filters
  regionSelect.addEventListener('change', renderTable);
  searchInput .addEventListener('input',  renderTable);
  riskFilter .addEventListener('change',  renderTable);

  // Sorting
  headers.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.dataset.sortKey;
      if (sortKey===key) sortDir = -sortDir;
      else { sortKey = key; sortDir = 1; }
      headers.forEach(h=>h.classList.remove('asc','desc'));
      th.classList.add(sortDir===1 ? 'asc' : 'desc');
      renderTable();
    });
  });

  // Re-run full scan
  rerunBtn.addEventListener('click', () => {
    updateKPIs();
    renderTable();
  });

  // Light/Dark toggle
  themeToggle.addEventListener('click', () => {
    const b = document.body;
    b.dataset.theme = b.dataset.theme==='dark' ? 'light' : 'dark';
    themeToggle.textContent = b.dataset.theme==='dark' ? '🌙' : '☀️';
  });

  // ── Initial paint ────────────────────────────────────────────────────────
  updateKPIs();
  renderTable();
});
