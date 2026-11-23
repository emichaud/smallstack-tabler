// Tabler 1.4 bundles Bootstrap under window.tabler.bootstrap and no longer
// exposes the conventional global `bootstrap`. Alias it so code using
// `new bootstrap.Modal(...)`, tooltips/popovers, and the htmx re-init
// patterns keep working. Load right after tabler.min.js.
if (typeof window.bootstrap === 'undefined' && window.tabler && window.tabler.bootstrap) {
    window.bootstrap = window.tabler.bootstrap;
}
