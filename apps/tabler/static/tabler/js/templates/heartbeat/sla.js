// Moved from apps/tabler/templates/heartbeat/sla.html (inline <script>) so the CSP needs no 'unsafe-inline'.
function slaModalOpen() {
    document.getElementById('sla-confirm-modal').style.display = 'flex';
}
function slaModalClose() {
    document.getElementById('sla-confirm-modal').style.display = 'none';
}
function slaModalConfirm() {
    slaModalClose();
    document.getElementById('sla-form').submit();
}
document.addEventListener('click', function(e) {
    if (e.target.id === 'sla-confirm-modal') slaModalClose();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') slaModalClose();
});
// Exposed to data-ss-action="…" in the markup (see theme.js: declarative behaviours).
window.SmallStack = window.SmallStack || {};
window.SmallStack.actions = Object.assign(window.SmallStack.actions || {}, { slaModalOpen: window.slaModalOpen, slaModalClose: window.slaModalClose, slaModalConfirm: window.slaModalConfirm });
