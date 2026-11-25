// Moved from apps/tabler/templates/explorer/examples/{single_model,group,app}_page.html (inline <script>) so the CSP needs no 'unsafe-inline'.
(function() {
    const tabs = document.getElementById('example-tabs');
    const panels = document.querySelectorAll('.example-tab-panel');
    tabs.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-tab]');
        if (!btn) return;
        tabs.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(p => { p.style.display = p.id === 'tab-' + btn.dataset.tab ? '' : 'none'; p.classList.toggle('active', p.id === 'tab-' + btn.dataset.tab); });
    });
    document.querySelectorAll('.example-copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.closest('.example-code-wrap').querySelector('code');
            navigator.clipboard.writeText(code.textContent).then(() => {
                this.textContent = 'Copied!'; this.style.color = 'var(--tblr-primary)';
                setTimeout(() => { this.textContent = 'Copy'; this.style.color = ''; }, 1500);
            });
        });
    });
})();
