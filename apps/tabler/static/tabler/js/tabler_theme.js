/**
 * Tabler Theme Settings — SmallStack
 *
 * Handles the offcanvas theme settings panel:
 * - Color mode (dark/light)
 * - Color scheme (accent color)
 * - Layout (default/condensed/sticky)
 * - Navbar position (top/side)
 *
 * All settings persist to localStorage and apply immediately.
 */
(function() {
    'use strict';

    var PREFIX = 'smallstack-';
    var SETTINGS_ID = 'offcanvas-settings';

    // Default config
    var defaults = {
        theme: 'dark',
        color: 'amber',
        layout: 'default',
        navbar: 'top'
    };

    // Color map: name → hex
    var colorMap = {
        amber:  '#f59f00',
        blue:   '#206bc4',
        azure:  '#4299e1',
        indigo: '#4263eb',
        purple: '#ae3ec9',
        pink:   '#d6336c',
        red:    '#d63939',
        orange: '#f76707',
        green:  '#2fb344',
        teal:   '#0ca678',
        cyan:   '#17a2b8'
    };

    function hexToRgb(hex) {
        var r = parseInt(hex.slice(1,3), 16);
        var g = parseInt(hex.slice(3,5), 16);
        var b = parseInt(hex.slice(5,7), 16);
        return r + ', ' + g + ', ' + b;
    }

    function get(key) {
        return localStorage.getItem(PREFIX + key) || defaults[key];
    }

    function set(key, value) {
        localStorage.setItem(PREFIX + key, value);
    }

    // ─── Theme (dark/light) ─────────────────────────────────
    function applyTheme(theme) {
        set('theme', theme);
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
        }
        document.documentElement.setAttribute('data-bs-theme', theme);
        document.documentElement.dataset.stkTheme = theme;

        // Update profile edit hidden input if present
        var themeInput = document.getElementById('id_theme_preference');
        if (themeInput) themeInput.value = theme;

        // Update toggle button states on profile edit page
        document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });

        // Persist to profile if authenticated
        if (typeof htmx !== 'undefined') {
            htmx.ajax('POST', '/profile/theme/', {
                values: { theme: theme },
                swap: 'none'
            });
        }
    }

    // ─── Color scheme ───────────────────────────────────────
    function applyColor(name) {
        set('color', name);
        var hex = colorMap[name] || colorMap.amber;
        var rgb = hexToRgb(hex);
        var root = document.documentElement.style;
        root.setProperty('--tblr-primary', hex);
        root.setProperty('--tblr-primary-rgb', rgb);

        // If default amber, remove dynamic overrides — CSS handles it
        var btnStyle = document.getElementById('stk-dynamic-btn-css');
        if (name === 'amber') {
            if (btnStyle) btnStyle.remove();
            return;
        }

        if (!btnStyle) {
            btnStyle = document.createElement('style');
            btnStyle.id = 'stk-dynamic-btn-css';
            document.head.appendChild(btnStyle);
        }

        // Darken for hover: reduce each channel by ~10%
        var r = parseInt(hex.slice(1,3), 16);
        var g = parseInt(hex.slice(3,5), 16);
        var b = parseInt(hex.slice(5,7), 16);
        var hoverHex = '#' +
            Math.round(r * 0.9).toString(16).padStart(2, '0') +
            Math.round(g * 0.9).toString(16).padStart(2, '0') +
            Math.round(b * 0.9).toString(16).padStart(2, '0');

        // Determine text color for contrast
        var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        var textColor = lum > 0.5 ? '#1a1c23' : '#ffffff';

        btnStyle.textContent =
            '.btn-primary,.btn-warning{background-color:' + hex + ' !important;border-color:' + hex + ' !important;color:' + textColor + ' !important}' +
            '.btn-primary:hover,.btn-warning:hover{background-color:' + hoverHex + ' !important;border-color:' + hoverHex + ' !important;color:' + textColor + ' !important}' +
            '.btn-outline-primary{color:' + hex + ' !important;border-color:' + hex + ' !important}' +
            '.btn-outline-primary:hover{background-color:' + hex + ' !important;color:' + textColor + ' !important}' +
            '.card-body a:not(.btn):not(.nav-link):not(.dropdown-item),.card a:not(.btn):not(.nav-link):not(.dropdown-item),.page-body a:not(.btn):not(.nav-link):not(.dropdown-item){color:' + hex + '}' +
            '.nav-tabs .nav-link.active{color:' + hex + ' !important;border-bottom-color:' + hex + ' !important}' +
            '.navbar .nav-link.active{color:' + hex + ' !important}' +
            '.navbar .nav-link:hover .nav-link-icon{color:' + hex + ' !important}' +
            '.form-control:focus,.form-select:focus{border-color:' + hex + ' !important;box-shadow:0 0 0 0.25rem rgba(' + rgb + ',0.15) !important}' +
            '.text-amber,.text-primary{color:' + hex + ' !important}' +
            '.bg-amber,.bg-primary{background-color:' + hex + ' !important}' +
            '.progress-bar{background-color:' + hex + '}' +
            '.slide-content h1{border-bottom-color:' + hex + '}' +
            '.slide-content code{color:' + hex + '}' +
            '.slides-progress-bar{background:' + hex + '}';
    }

    // ─── Layout ─────────────────────────────────────────────
    function applyLayout(layout) {
        set('layout', layout);
        document.body.classList.remove('layout-condensed');
        var nav = document.querySelector('.navbar');
        if (nav) nav.classList.remove('navbar-sticky');

        if (layout === 'condensed') {
            document.body.classList.add('layout-condensed');
        } else if (layout === 'sticky') {
            if (nav) nav.classList.add('navbar-sticky');
        }
    }

    // ─── Navbar position ────────────────────────────────────
    function applyNavbar(position) {
        set('navbar', position);
        var page = document.querySelector('.page');
        var navbar = document.querySelector('.navbar');
        if (!page || !navbar) return;

        if (position === 'side') {
            page.classList.add('navbar-side');
            navbar.classList.remove('navbar-expand-md');
            navbar.classList.add('navbar-vertical', 'navbar-expand-lg');
        } else {
            page.classList.remove('navbar-side');
            navbar.classList.add('navbar-expand-md');
            navbar.classList.remove('navbar-vertical', 'navbar-expand-lg');
        }
    }

    // ─── Sync radio buttons in panel ────────────────────────
    function syncPanel() {
        var panel = document.getElementById(SETTINGS_ID);
        if (!panel) return;

        var settings = {
            'stk-theme': get('theme'),
            'stk-color': get('color'),
            'stk-layout': get('layout'),
            'stk-navbar': get('navbar')
        };

        for (var name in settings) {
            var radios = panel.querySelectorAll('[name="' + name + '"]');
            radios.forEach(function(radio) {
                radio.checked = radio.value === settings[name];
            });
        }
    }

    // ─── Reset to defaults ──────────────────────────────────
    function resetAll() {
        for (var key in defaults) {
            localStorage.removeItem(PREFIX + key);
        }
        // Remove dynamic styles
        var dynStyle = document.getElementById('stk-dynamic-btn-css');
        if (dynStyle) dynStyle.remove();
        document.documentElement.style.removeProperty('--tblr-primary');
        document.documentElement.style.removeProperty('--tblr-primary-rgb');

        applyTheme(defaults.theme);
        applyColor(defaults.color);
        applyLayout(defaults.layout);
        applyNavbar(defaults.navbar);
        syncPanel();
    }

    // ─── Init ───────────────────────────────────────────────
    function init() {
        // Apply all saved settings
        applyTheme(get('theme'));
        applyColor(get('color'));
        applyLayout(get('layout'));
        applyNavbar(get('navbar'));

        // Sync panel radios
        syncPanel();

        // Listen for changes in settings panel
        var panel = document.getElementById(SETTINGS_ID);
        if (panel) {
            panel.addEventListener('change', function(e) {
                var target = e.target;
                if (target.name === 'stk-theme') applyTheme(target.value);
                else if (target.name === 'stk-color') applyColor(target.value);
                else if (target.name === 'stk-layout') applyLayout(target.value);
                else if (target.name === 'stk-navbar') applyNavbar(target.value);
            });
        }

        // Reset button
        var resetBtn = document.getElementById('settings-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAll);
        }

        // Legacy: theme toggle buttons on profile edit page
        document.querySelectorAll('.theme-toggle-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                applyTheme(this.dataset.theme);
                syncPanel();
            });
        });

        // Legacy: data-theme-toggle (quick toggle from any page)
        document.querySelectorAll('[data-theme-toggle]').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                applyTheme(get('theme') === 'dark' ? 'light' : 'dark');
                syncPanel();
            });
        });
    }

    // Expose globally
    window.SmallStackTheme = {
        applyTheme: applyTheme,
        applyColor: applyColor,
        applyLayout: applyLayout,
        applyNavbar: applyNavbar,
        get: get,
        reset: resetAll
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
