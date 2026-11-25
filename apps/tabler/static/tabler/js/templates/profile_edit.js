// Moved from apps/tabler/templates/profile/profile_edit.html (inline <script>) so the CSP needs no 'unsafe-inline'.
// Preview uploaded profile photo
document.getElementById('id_profile_photo').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = document.getElementById('profile-photo-preview');
            var avatar = document.getElementById('profile-photo-avatar');
            preview.src = e.target.result;
            preview.style.display = 'inline-flex';
            if (avatar) avatar.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Preview uploaded cover photo
document.getElementById('id_background_photo').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var preview = document.getElementById('cover-photo-preview');
            var current = document.getElementById('cover-photo-current');
            preview.src = e.target.result;
            preview.style.display = 'block';
            if (current) current.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
});

// Live timezone preview
(function() {
    var tzSelect = document.getElementById('id_timezone');
    var preview = document.getElementById('tz-preview');
    if (!tzSelect || !preview) return;

    function formatTime(date, tz, withZone) {
        try {
            var opts = {
                timeZone: tz,
                month: 'short', day: 'numeric', year: 'numeric',
                hour: 'numeric', minute: '2-digit', second: '2-digit',
                hour12: true
            };
            if (withZone) opts.timeZoneName = 'short';
            return date.toLocaleString('en-US', opts);
        } catch (e) { return null; }
    }

    function row(label, time) {
        return '<div class="tz-preview-row"><span class="tz-preview-label">' + label +
               '</span><span class="tz-preview-time">' + time + '</span></div>';
    }

    function updatePreview() {
        var tz = tzSelect.value;
        if (!tz) { preview.innerHTML = ''; return; }
        var now = new Date();
        var utcStr = formatTime(now, 'UTC', false);
        var localStr = formatTime(now, tz, true);
        if (utcStr && localStr) {
            preview.innerHTML = row('UTC', utcStr) + row('Local', localStr);
        } else {
            preview.innerHTML = '';
        }
    }

    tzSelect.addEventListener('change', updatePreview);
    updatePreview();
    setInterval(updatePreview, 1000);
})();
