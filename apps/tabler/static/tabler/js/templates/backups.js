// Moved from apps/tabler/templates/smallstack/backups.html (inline <script>) so the CSP needs no 'unsafe-inline'.
// Server values arrive as data- attributes on this script's tag.
var backupsConfig = document.currentScript.dataset;

function _getCSRFToken() {
    var el = document.querySelector('[name=csrfmiddlewaretoken]');
    if (el) return el.value;
    var match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : '';
}

function backupNow() {
    var btn = document.getElementById('backup-now-btn');
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    var label = document.getElementById('backup-label');
    if (label) label.textContent = 'Creating\u2026';

    fetch(backupsConfig.backupNowUrl, {
        method: 'POST',
        headers: { 'X-CSRFToken': _getCSRFToken() },
        credentials: 'same-origin'
    })
    .then(function(response) {
        if (label) label.textContent = 'Backup Now';
        delete btn.dataset.busy;
        htmx.ajax('GET', backupsConfig.backupsUrl, {
            target: '#backup-page-content',
            swap: 'innerHTML'
        });
    })
    .catch(function(err) {
        if (label) label.textContent = 'Failed';
        setTimeout(function() {
            if (label) label.textContent = 'Backup Now';
            delete btn.dataset.busy;
        }, 2000);
    });
}

function downloadBackup() {
    var btn = document.getElementById('download-btn');
    if (btn.dataset.busy) return;
    btn.dataset.busy = '1';
    var label = document.getElementById('download-label');
    if (label) label.textContent = 'Creating\u2026';

    fetch(backupsConfig.backupDownloadUrl, {
        method: 'POST',
        headers: { 'X-CSRFToken': _getCSRFToken() },
        credentials: 'same-origin'
    })
    .then(function(response) {
        if (!response.ok) throw new Error('Download failed');
        var disposition = response.headers.get('Content-Disposition') || '';
        var filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        var filename = filenameMatch ? filenameMatch[1] : 'backup.sqlite3';
        return response.blob().then(function(blob) {
            return {blob: blob, filename: filename};
        });
    })
    .then(function(result) {
        var url = URL.createObjectURL(result.blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        if (label) label.textContent = 'Download';
        delete btn.dataset.busy;
        htmx.ajax('GET', backupsConfig.backupsUrl, {
            target: '#backup-page-content',
            swap: 'innerHTML'
        });
    })
    .catch(function(err) {
        if (label) label.textContent = 'Failed';
        setTimeout(function() {
            if (label) label.textContent = 'Download';
            delete btn.dataset.busy;
        }, 2000);
    });
}
// Exposed to data-ss-action="…" in the markup (see theme.js: declarative behaviours).
window.SmallStack = window.SmallStack || {};
window.SmallStack.actions = Object.assign(window.SmallStack.actions || {}, { backupNow: window.backupNow, downloadBackup: window.downloadBackup });
