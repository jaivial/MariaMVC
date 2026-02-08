const STORAGE_KEY = 'aurelia-crm-transactions-v1';

const seedData = [
  { name: 'Theo Lawrence', type: 'income', amount: 500, method: 'Credit Card', date: '2024-10-18', status: 'Success' },
  { name: 'Amy March', type: 'expense', amount: 250, method: 'Bank Transfer', date: '2024-10-20', status: 'Pending' },
  { name: 'Melissa Green', type: 'income', amount: 780, method: 'VISA', date: '2024-10-24', status: 'Success' },
  { name: 'Young Alaska', type: 'expense', amount: 180, method: 'Cash', date: '2024-10-28', status: 'Success' },
  { name: 'Ruben Hall', type: 'income', amount: 1250, method: 'Bank Transfer', date: '2024-11-03', status: 'Success' },
  { name: 'Nina Black', type: 'expense', amount: 310, method: 'Credit Card', date: '2024-11-05', status: 'Success' },
  { name: 'Lena White', type: 'income', amount: 430, method: 'VISA', date: '2024-11-10', status: 'Success' },
  { name: 'Bruno King', type: 'expense', amount: 140, method: 'Cash', date: '2024-11-12', status: 'Pending' },
];

const formatCurrency = (n) => `€ ${n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const readData = () => {
  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (fromStorage) return JSON.parse(fromStorage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
  return [...seedData];
};

let transactions = readData();
let currentPeriod = 30;

const refs = {
  periodBtn: document.getElementById('periodBtn'),
  exportBtn: document.getElementById('exportBtn'),
  totalBalance: document.getElementById('totalBalance'),
  balanceDelta: document.getElementById('balanceDelta'),
  incomeMetric: document.getElementById('incomeMetric'),
  expenseMetric: document.getElementById('expenseMetric'),
  netMetric: document.getElementById('netMetric'),
  bars: document.getElementById('bars'),
  kpis: document.getElementById('kpis'),
  activityRows: document.getElementById('activityRows'),
  cardBalance: document.getElementById('cardBalance'),
  searchInput: document.getElementById('searchInput'),
  movementForm: document.getElementById('movementForm'),
  toggleFormBtn: document.getElementById('toggleFormBtn'),
  addFormWrap: document.getElementById('addFormWrap'),
  seedBtn: document.getElementById('seedBtn'),
};

const periodCutoff = (days) => {
  const maxDate = transactions.reduce((max, t) => (t.date > max ? t.date : max), transactions[0]?.date || '2024-11-30');
  const d = new Date(maxDate);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
};

const filteredTx = () => {
  const q = refs.searchInput.value.trim().toLowerCase();
  const cutoff = periodCutoff(currentPeriod);
  return transactions.filter((t) => t.date >= cutoff && `${t.name} ${t.method}`.toLowerCase().includes(q));
};

const persist = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));

const renderBars = (txs) => {
  refs.bars.innerHTML = '';
  const buckets = Array.from({ length: 12 }, () => ({ in: 0, out: 0 }));

  txs.forEach((t, i) => {
    const bucket = buckets[i % buckets.length];
    if (t.type === 'income') bucket.in += t.amount;
    else bucket.out += t.amount;
  });

  const max = Math.max(1, ...buckets.map((bucket) => Math.max(bucket.in, bucket.out)));
  buckets.forEach((bucket) => {
    const inBar = document.createElement('div');
    inBar.className = 'bar in';
    inBar.style.height = `${Math.max(6, (bucket.in / max) * 100)}%`;
    refs.bars.appendChild(inBar);

    const outBar = document.createElement('div');
    outBar.className = 'bar out';
    outBar.style.height = `${Math.max(6, (bucket.out / max) * 100)}%`;
    refs.bars.appendChild(outBar);
  });
};

const renderKPIs = (income, expense, net) => {
  refs.kpis.innerHTML = `
    <article class="card kpi"><h5>Business Account</h5><p>${formatCurrency(income * 0.72)}</p><small>Last ${currentPeriod} days</small></article>
    <article class="card kpi"><h5>Total Saving</h5><p>${formatCurrency(Math.max(0, net * 0.31))}</p><small>Last ${currentPeriod} days</small></article>
    <article class="card kpi"><h5>Tax Reserve</h5><p>${formatCurrency(income * 0.19)}</p><small>Last ${currentPeriod} days</small></article>
  `;
};

const renderTable = (txs) => {
  refs.activityRows.innerHTML = txs
    .slice()
    .reverse()
    .slice(0, 8)
    .map(
      (t) => `
      <div class="row">
        <span>${t.name}</span>
        <span class="${t.type === 'expense' ? 'neg' : ''}">${t.type === 'expense' ? '-' : ''}${formatCurrency(t.amount)}</span>
        <span><span class="badge ${t.status === 'Success' ? 'success' : 'pending'}">${t.status}</span></span>
        <span>${t.method}</span>
      </div>
    `,
    )
    .join('');
};

const render = () => {
  const txs = filteredTx();
  const income = txs.filter((t) => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = txs.filter((t) => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const net = income - expense;
  const base = 320000;

  refs.totalBalance.textContent = formatCurrency(net + base);
  const delta = ((net / Math.max(1, income + expense)) * 100).toFixed(1);
  refs.balanceDelta.textContent = `${delta >= 0 ? '+' : ''}${delta}%`;
  refs.balanceDelta.style.color = delta >= 0 ? '#41df99' : '#ff9bb4';

  refs.incomeMetric.textContent = formatCurrency(income);
  refs.expenseMetric.textContent = formatCurrency(expense);
  refs.netMetric.textContent = formatCurrency(net);
  refs.cardBalance.textContent = formatCurrency(Math.max(0, net * 0.36 + 3500));

  renderBars(txs);
  renderKPIs(income, expense, net);
  renderTable(txs);
};

refs.periodBtn.addEventListener('click', () => {
  currentPeriod = currentPeriod === 30 ? 60 : 30;
  refs.periodBtn.textContent = currentPeriod === 30 ? 'Last 30 days' : 'Last 60 days';
  render();
});

refs.searchInput.addEventListener('input', render);

refs.toggleFormBtn.addEventListener('click', () => {
  refs.addFormWrap.hidden = !refs.addFormWrap.hidden;
});

refs.movementForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(refs.movementForm);

  transactions.push({
    name: String(data.get('name')),
    type: String(data.get('type')),
    amount: Number(data.get('amount')),
    method: String(data.get('method')),
    date: new Date().toISOString().slice(0, 10),
    status: 'Success',
  });

  persist();
  refs.movementForm.reset();
  refs.addFormWrap.hidden = true;
  render();
});

refs.seedBtn.addEventListener('click', () => {
  transactions = [...seedData];
  persist();
  render();
});

refs.exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'aurelia-crm-transactions.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

render();
