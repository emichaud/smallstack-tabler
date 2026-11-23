// Tabler first-paint script — a plain, blocking <script src> in <head>, before
// the stylesheets' first render, so the page opens in the right colour mode
// without a flash and without an inline <script> (the CSP's script-src is
// 'self'). Configured by data- attributes on its tag:
//
//   data-user-theme="…"   the signed-in user's saved theme (empty when signed out)
//
// Order, as upstream theme-init.js: the profile's choice, then this browser's,
// then dark. Font, base and radius come from this browser only (the settings
// panel keeps them in localStorage; see tabler_theme.js).
(function () {
    var root = document.documentElement;
    var cfg = (document.currentScript && document.currentScript.dataset) || {};
    var stored = null, font = null, base = null, radius = null;
    try {
        stored = localStorage.getItem('smallstack-theme');
        font = localStorage.getItem('smallstack-font');
        base = localStorage.getItem('smallstack-base');
        radius = localStorage.getItem('smallstack-radius');
    } catch (e) { /* storage unavailable */ }
    var t = cfg.userTheme || stored || 'dark';
    if (cfg.userTheme && stored !== cfg.userTheme) {
        try { localStorage.setItem('smallstack-theme', cfg.userTheme); } catch (e) { /* ignore */ }
    }
    if (t === 'dark') {
        if (document.body) document.body.classList.add('theme-dark');
        else document.addEventListener('DOMContentLoaded', function () { document.body.classList.add('theme-dark'); });
    }
    root.setAttribute('data-bs-theme', t);
    root.setAttribute('data-theme', t);   // upstream per-page CSS keys its dark rules on this
    root.dataset.stkTheme = t;
    if (font && font !== 'sans-serif') root.setAttribute('data-bs-theme-font', font);
    if (base && base !== 'gray') root.setAttribute('data-bs-theme-base', base);
    if (radius && radius !== '1') root.setAttribute('data-bs-theme-radius', radius);
})();
