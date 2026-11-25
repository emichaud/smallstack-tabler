// Moved from apps/tabler/templates/heartbeat/dashboard.html (inline <script>) so the CSP needs no 'unsafe-inline'.
// htmx tab switching for heartbeat log
document.querySelectorAll('#view-log .nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('#view-log .nav-link').forEach(function(l) { l.classList.remove('active'); });
        this.classList.add('active');
    });
});

function copyJson() {
    var text = document.getElementById('json-content').textContent;
    navigator.clipboard.writeText(text);
    var btn = document.getElementById('copy-json-btn');
    btn.textContent = 'Copied!';
    setTimeout(function() { btn.textContent = 'Copy'; }, 1500);
}
// Exposed to data-ss-action="…" in the markup (see theme.js: declarative behaviours).
window.SmallStack = window.SmallStack || {};
window.SmallStack.actions = Object.assign(window.SmallStack.actions || {}, { copyJson: window.copyJson });
