// Moved from apps/tabler/templates/explorer/index.html (inline <script>) so the CSP needs no 'unsafe-inline'.
(function() {
    // Sidebar mode toggle
    const modeToggle = document.getElementById('sidebar-mode');
    const groupPanel = document.getElementById('sidebar-group');
    const appPanel = document.getElementById('sidebar-app');

    modeToggle.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-mode]');
        if (!btn) return;
        const mode = btn.dataset.mode;
        modeToggle.querySelectorAll('button').forEach(b => {
            b.style.background = '';
            b.style.color = '';
        });
        btn.style.background = 'rgba(var(--tblr-primary-rgb), 0.1)';
        btn.style.color = 'var(--tblr-primary)';
        groupPanel.style.display = mode === 'group' ? '' : 'none';
        appPanel.style.display = mode === 'app' ? '' : 'none';
        localStorage.setItem('explorer-sidebar-mode', mode);
        window.location.href = '?by=' + mode;
    });

    // Restore sidebar mode
    const params = new URLSearchParams(window.location.search);
    if (!params.has('by')) {
        const saved = localStorage.getItem('explorer-sidebar-mode');
        if (saved === 'app') {
            modeToggle.querySelectorAll('button').forEach(b => { b.style.background = ''; b.style.color = ''; });
            modeToggle.querySelector('[data-mode="app"]').style.background = 'rgba(var(--tblr-primary-rgb), 0.1)';
            modeToggle.querySelector('[data-mode="app"]').style.color = 'var(--tblr-primary)';
            groupPanel.style.display = 'none';
            appPanel.style.display = '';
        }
    }

    // Sidebar filter
    document.getElementById('sidebar-filter').addEventListener('input', function() {
        const q = this.value.toLowerCase();
        document.querySelectorAll('.explorer-nav .nav-link').forEach(link => {
            if (link.textContent.trim() === 'All Models') return;
            link.style.display = (!q || link.textContent.toLowerCase().includes(q)) ? '' : 'none';
        });
    });

    // Client-side search
    const searchInput = document.getElementById('explorer-search');
    const cards = document.querySelectorAll('.explorer-card');
    const modelCount = document.getElementById('explorer-model-count');
    const recordCount = document.getElementById('explorer-record-count');

    searchInput.addEventListener('input', function() {
        const q = this.value.toLowerCase();
        let visible = 0, records = 0;
        cards.forEach(card => {
            const text = (card.dataset.name || '') + ' ' + (card.dataset.app || '') + ' ' + (card.dataset.group || '');
            const match = !q || text.toLowerCase().includes(q);
            card.style.display = match ? '' : 'none';
            if (match) { visible++; records += parseInt(card.dataset.count || '0', 10); }
        });
        modelCount.textContent = visible;
        recordCount.textContent = records.toLocaleString();
    });
})();
