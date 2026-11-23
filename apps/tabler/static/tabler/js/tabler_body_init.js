// Runs synchronously right after <body> opens (a blocking <script src>, no
// defer): the colour-mode class and the layout variant go on <body> before
// its children paint. Was an inline <script>; moved out for the CSP.
(function () {
    var t = 'dark', layout = 'default';
    try {
        t = localStorage.getItem('smallstack-theme') || t;
        layout = localStorage.getItem('smallstack-layout') || layout;
    } catch (e) { /* storage unavailable */ }
    // The profile's theme, when tabler_init.js saw one, is already in localStorage.
    if (t === 'dark') document.body.classList.add('theme-dark');
    if (layout === 'sticky') layout = 'navbar-sticky';   // legacy value
    if (layout === 'boxed') document.body.classList.add('layout-boxed');
    else if (layout === 'condensed') document.body.classList.add('layout-condensed');
    else if (layout === 'fluid') document.body.classList.add('layout-fluid');
})();
