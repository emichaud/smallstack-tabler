// Moved from apps/tabler/templates/explorer/examples/heartbeat_page.html (inline <script>) so the CSP needs no 'unsafe-inline'.
(function() {
    // Tab switching
    const tabs = document.getElementById('example-tabs');
    const panels = document.querySelectorAll('.example-tab-panel');
    tabs.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-tab]');
        if (!btn) return;
        tabs.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(p => {
            if (p.id === 'tab-' + btn.dataset.tab) {
                p.classList.add('active');
                p.style.display = '';
            } else {
                p.classList.remove('active');
                p.style.display = 'none';
            }
        });
    });

    // Copy buttons
    document.querySelectorAll('.example-copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.closest('.example-code-wrap').querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                const orig = this.textContent;
                this.textContent = 'Copied!';
                this.style.color = 'var(--tblr-primary)';
                this.style.borderColor = 'var(--tblr-primary)';
                setTimeout(() => { this.textContent = orig; this.style.color = ''; this.style.borderColor = ''; }, 1500);
            });
        });
    });

    // Animate chart bars
    const chart = document.getElementById('hb-chart');
    if (chart) {
        const groups = chart.querySelectorAll('.hb-chart-bar-group');
        let maxTotal = 0;
        groups.forEach(g => {
            const total = parseInt(g.dataset.ok || 0) + parseInt(g.dataset.fail || 0);
            if (total > maxTotal) maxTotal = total;
        });
        if (maxTotal === 0) maxTotal = 1;
        requestAnimationFrame(() => {
            groups.forEach(g => {
                const ok = parseInt(g.dataset.ok || 0);
                const fail = parseInt(g.dataset.fail || 0);
                g.querySelector('.hb-chart-bar-ok').style.height = ((ok / maxTotal) * 100) + '%';
                g.querySelector('.hb-chart-bar-fail').style.height = ((fail / maxTotal) * 100) + '%';
            });
        });
    }

    // Column sorting on CRUD table
    const table = document.querySelector('.crud-table');
    if (table) {
        const headers = table.querySelectorAll('thead th');
        const tbody = table.querySelector('tbody');
        headers.forEach((th, colIdx) => {
            if (th.textContent.trim().toLowerCase() === 'actions') return;
            th.classList.add('sortable');
            th.addEventListener('click', function() {
                const isAsc = th.classList.contains('sort-asc');
                headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                const dir = isAsc ? 'desc' : 'asc';
                th.classList.add('sort-' + dir);
                const rows = Array.from(tbody.querySelectorAll('tr'));
                rows.sort((a, b) => {
                    const aCell = a.children[colIdx], bCell = b.children[colIdx];
                    if (!aCell || !bCell) return 0;
                    let aVal = aCell.textContent.trim(), bVal = bCell.textContent.trim();
                    const aNum = parseFloat(aVal.replace(/[^0-9.\-]/g, '')), bNum = parseFloat(bVal.replace(/[^0-9.\-]/g, ''));
                    if (!isNaN(aNum) && !isNaN(bNum)) return dir === 'asc' ? aNum - bNum : bNum - aNum;
                    const aDate = Date.parse(aVal), bDate = Date.parse(bVal);
                    if (!isNaN(aDate) && !isNaN(bDate)) return dir === 'asc' ? aDate - bDate : bDate - aDate;
                    return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                });
                rows.forEach(r => tbody.appendChild(r));
            });
        });
    }
})();

function openDayDrilldown(el) {
    const ok = parseInt(el.dataset.ok || 0);
    const fail = parseInt(el.dataset.fail || 0);
    const total = ok + fail;
    const uptime = total > 0 ? ((ok / total) * 100).toFixed(1) : '0.0';
    const body = document.getElementById('stat-modal-body');
    body.innerHTML = '<table class="table table-vcenter">' +
        '<thead><tr><th>Status</th><th>Count</th><th>Percentage</th></tr></thead>' +
        '<tbody>' +
        '<tr><td><span class="badge bg-success me-1"></span>OK</td><td>' + ok + '</td><td>' + uptime + '%</td></tr>' +
        '<tr><td><span class="badge bg-danger me-1"></span>Failed</td><td>' + fail + '</td><td>' + (total > 0 ? ((fail / total) * 100).toFixed(1) : '0.0') + '%</td></tr>' +
        '<tr class="fw-bold"><td>Total</td><td>' + total + '</td><td>&mdash;</td></tr>' +
        '</tbody></table>';
    openStatModal(el.dataset.label + ' \u2014 ' + el.dataset.date);
}
// Exposed to data-ss-action="…" in the markup (see theme.js: declarative behaviours).
window.SmallStack = window.SmallStack || {};
window.SmallStack.actions = Object.assign(window.SmallStack.actions || {}, { openDayDrilldown: window.openDayDrilldown });
