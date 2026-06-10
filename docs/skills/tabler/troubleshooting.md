# Troubleshooting — Tabler-specific issues

**Use this skill when** something visual or behavioral is broken: FOUC, theme not persisting, charts ignoring dark mode, htmx swaps killing Tabler JS, settings panel out of sync, CDN failures, dropdowns/modals not working.

## Symptom index

| Symptom | Section |
|---------|---------|
| Page flashes light theme before going dark (FOUC) | [FOUC](#flash-of-unstyled-content-fouc) |
| Theme reverts after navigation | [Theme not persisting](#theme-not-persisting) |
| Accent color choice resets | [Accent color reset](#accent-color-resets-on-reload) |
| Chart stays primary color when accent changes | [Chart theme refresh](#charts-don't-respect-theme-changes) |
| Chart looks wrong in dark mode | [Chart dark mode](#charts-look-wrong-in-dark-mode) |
| Dropdown doesn't open after htmx swap | [Tabler JS after swap](#bootstrap-components-stop-working-after-htmx-swap) |
| Tooltip works on initial page but not new content | [Tabler JS after swap](#bootstrap-components-stop-working-after-htmx-swap) |
| Settings panel radios show wrong values | [Settings panel out of sync](#settings-panel-radios-out-of-sync) |
| CDN fails to load | [CDN issues](#cdn-fails-to-load) |
| Modal opens but is empty / shows old content | [Modal htmx](#modal-loads-stale-content) |
| Vertical layout doesn't appear | [Vertical layout missing](#vertical-layout-doesn't-render) |
| Login page shows the navbar | [Wrong auth base](#auth-page-shows-the-navbar) |
| ApexCharts container has 0 height | [Chart sizing](#chart-renders-with-zero-height) |
| Sortable.js drop doesn't save | [Sortable + CSRF](#sortable.js-onend-doesn't-persist) |
| Forms styled inconsistently | [Form widget classes](#django-form-fields-don't-have-tabler-styling) |

## Flash of unstyled content (FOUC)

### Symptom
Page briefly appears in light mode (or wrong color) before settling to the user's preferred theme.

### Cause
The blocking theme script in `<head>` only sets `data-bs-theme` attribute on `<html>` and (if body exists) the `theme-dark` class. There's a brief window before the body parses where the body has no class. Tabler's CSS uses both signals; the `<html>` attribute reaches first.

### Diagnosis
Open DevTools, throttle CPU to 6x slowdown, reload. If FOUC visible, the blocker may not be running.

Check `<head>` of base.html for the inline script at lines 10-26. It must:
- Be the FIRST script in `<head>`
- Have no `defer` or `async`
- Read `localStorage.getItem('smallstack-theme')`

### Fix
Already in `tabler/base.html`. If you forked the base, ensure the inline script is preserved and runs synchronously.

For extra safety, hide the body until ready:
```html
<style>
html:not([data-bs-theme]) body { visibility: hidden; }
</style>
```
The blocker sets `data-bs-theme` immediately, making the body visible.

## Theme not persisting

### Symptom
User toggles dark mode, then on next page load, the theme is back to default.

### Cause
Either `localStorage` isn't being written, or the blocking script can't read it.

### Diagnosis
1. Open DevTools → Application → Local Storage → your origin
2. Look for `smallstack-theme=dark`
3. If absent, the engine isn't running — check if `tabler_theme.js` loads (Network tab).
4. If present, the blocker isn't reading it — check `<head>` blocker for the correct key.

### Common cause
**Origin mismatch**: `localhost:8005` ≠ `localhost:8007`. If your user changes theme on one port, the other port has independent storage. Expected behavior.

**Privacy mode**: in incognito, `localStorage` clears on tab close. Expected behavior.

**Storage quota exceeded**: rare, but check for `Quota exceeded` console errors.

### Fix
Verify the script in `<head>` reads the right key (`smallstack-theme`). Verify `tabler_theme.js` writes the same key.

## Accent color resets on reload

### Symptom
You change the accent to purple, reload, and it's back to amber.

### Cause
The dynamic style injected by `applyColor()` lives in `<head>` as `<style id="stk-dynamic-btn-css">`. On reload, the engine reads `smallstack-color` from `localStorage` and re-injects. If the read fails or the value doesn't match expected, you get the default.

### Diagnosis
Console: `localStorage.getItem('smallstack-color')` — should match the chosen color name.

If yes: open Elements, find `<style id="stk-dynamic-btn-css">` — should exist with rules.

If the style exists but page still looks amber: a CSS specificity issue. Tabler's `.btn-primary` is overridden by the dynamic style with `!important`, but a third-party stylesheet may be winning.

### Fix
- Verify `localStorage` key
- Verify `tabler_theme.js` `applyColor()` runs (add `console.log` for debugging)
- Check for other stylesheets that re-override `.btn-primary`

## Charts don't respect theme changes

### Symptom
User toggles dark mode, but the chart axes stay light gray.

### Cause
ApexCharts reads colors once at `render()`. Subsequent theme changes don't propagate.

### Diagnosis
Open settings panel, change theme. Watch chart — if axes, grid, or colors stay frozen, you need a reactive handler.

### Fix
See [charts.md](charts.md) → "Reacting to theme changes". Use a MutationObserver on `<body>` class and `<html>` style, then `chart.updateOptions(...)`.

Quick fix for one chart:

```js
function refreshTheme() {
    const s = getComputedStyle(document.documentElement);
    chart.updateOptions({
        colors: [s.getPropertyValue('--tblr-primary').trim()],
        grid: { borderColor: s.getPropertyValue('--tblr-border-color').trim() },
        tooltip: { theme: document.body.classList.contains('theme-dark') ? 'dark' : 'light' },
    }, false, true);
}

new MutationObserver(refreshTheme).observe(document.body, { attributes: true, attributeFilter: ['class'] });
new MutationObserver(refreshTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
```

## Charts look wrong in dark mode

### Symptom
Bars on dark background are nearly invisible, or labels are unreadable.

### Cause
Default ApexCharts colors target light mode.

### Fix
Set tooltip theme + axis label colors:

```js
tooltip: { theme: document.body.classList.contains('theme-dark') ? 'dark' : 'light' },
xaxis: { labels: { style: { colors: getComputedStyle(document.documentElement).getPropertyValue('--tblr-muted').trim() } } },
yaxis: { labels: { style: { colors: getComputedStyle(document.documentElement).getPropertyValue('--tblr-muted').trim() } } },
```

See [charts.md](charts.md) for the full pattern.

## Bootstrap components stop working after htmx swap

### Symptom
After clicking a button that triggers an htmx swap, dropdowns, tooltips, popovers, or tabs in the swapped content don't respond to clicks.

### Cause
Tabler initializes Bootstrap components from `data-bs-toggle` attributes once at page load. New nodes from htmx don't get auto-initialized.

### Diagnosis
Click a dropdown in the swapped area. If nothing opens, check console — usually silent.

In console: `bootstrap.Dropdown.getInstance(document.querySelector('[data-bs-toggle="dropdown"]'))` — `null` means uninitialized.

### Fix
Add the global re-init listener:

```js
document.body.addEventListener('htmx:afterSwap', function(evt) {
    const root = evt.target;
    root.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        if (!bootstrap.Tooltip.getInstance(el)) new bootstrap.Tooltip(el);
    });
    root.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
        if (!bootstrap.Popover.getInstance(el)) new bootstrap.Popover(el);
    });
    root.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
        if (!bootstrap.Dropdown.getInstance(el)) new bootstrap.Dropdown(el);
    });
});
```

See [htmx-patterns.md](htmx-patterns.md) for the complete handler.

Modals, offcanvas, tabs, accordions, toasts have idempotent `data-bs-toggle` — they work after swap without re-init.

## Settings panel radios out of sync

### Symptom
The settings panel shows "Light" highlighted but the page is dark.

### Cause
`syncPanel()` runs on init and after `resetAll()`. If you call `applyTheme()` programmatically (via JS, not via the panel), the radio doesn't auto-update.

### Fix
Call `SmallStackTheme.syncPanel?.()` after any programmatic apply. Or always go through the panel by triggering a `change` event.

Quick test in console:
```js
SmallStackTheme.applyTheme('light');
// Panel still shows dark? Then syncPanel is not being called.
```

The engine in `tabler_theme.js` lines 240-259 syncs after `init()` and `resetAll()`. If you find a gap, add a call.

## CDN fails to load

### Symptom
Page renders unstyled (no Tabler CSS) or no interaction (no Tabler JS).

### Cause
- CDN outage (rare for jsdelivr)
- User's network blocks jsdelivr (corporate firewall)
- User offline

### Diagnosis
Open DevTools → Network. Filter by "tabler". Look for failed requests.

### Fix
**Short term**: self-host the assets. See [customization.md](customization.md) → "Switching to a local build".

**Long term**: add Subresource Integrity (SRI) checks to detect tampering, but accept that CDN means availability depends on the CDN.

### Local-fallback pattern

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta20/dist/css/tabler.min.css"
      onerror="this.onerror=null;this.href='{% static "tabler/vendor/tabler.min.css" %}';">
```

Browser support for `<link onerror>` is patchy — use a JS check as backup.

## Modal loads stale content

### Symptom
Open modal A, see content X. Open modal B, briefly see X before B's content loads.

### Cause
The modal body isn't cleared between opens — the previous content sits there while htmx fetches the new content.

### Fix
Clear before fetching:

```html
<a class="btn btn-primary"
   hx-get="{% url 'app:detail' obj.pk %}"
   hx-target="#modal-body"
   hx-on:click="document.getElementById('modal-body').innerHTML = '<div class=\'text-center py-5\'><div class=\'spinner-border\'></div></div>'"
   data-bs-toggle="modal" data-bs-target="#modal">View</a>
```

Or add htmx's "loading indicator" pattern:

```html
<div id="modal-body">
    <div class="htmx-indicator text-center py-5"><div class="spinner-border"></div></div>
</div>
```

(The `.htmx-indicator` is visible during requests via Tabler's `.htmx-request .htmx-indicator` rule.)

## Vertical layout doesn't render

### Symptom
User selects "Vertical" in settings panel, but the navbar stays horizontal.

### Cause
`applyLayout('vertical')` only adds `navbar-side` to `.page`. The CSS that creates the sidebar effect targets `.page.navbar-side` — if the CSS isn't loaded (e.g., a stripped `tabler_overrides.css`), nothing happens.

### Diagnosis
Inspect `.page` element in DevTools. Should have class `navbar-side` after selecting vertical.

If yes, check whether `tabler_overrides.css` includes selectors for `.page.navbar-side .navbar`.

### Fix
Verify `tabler_overrides.css` is loaded (Network tab). Verify it has the navbar-side selectors (search for `.navbar-side`).

If missing, the override file may have been replaced or truncated. Restore from git.

## Auth page shows the navbar

### Symptom
Login or signup page shows the main app navbar with logo + apps grid.

### Cause
Page extends `tabler/base.html` instead of `registration/tabler_auth_base.html`.

### Fix
Auth pages **must** extend `registration/tabler_auth_base.html`:

```django
{% extends "registration/tabler_auth_base.html" %}

{% block auth_content %}
... your login form ...
{% endblock %}
```

See [page-auth.md](page-auth.md).

## Chart renders with zero height

### Symptom
Chart container is in the DOM but no chart appears, or DevTools shows the container with `height: 0`.

### Cause
ApexCharts measures the container's height at `render()`. If the container is inside a hidden parent (collapsed accordion, inactive tab pane, `display:none`), the measurement is 0.

### Diagnosis
Inspect the container in DevTools while it should be visible. Confirm `clientHeight > 0`.

### Fix
**Inline charts in tab panes**: render lazily when the tab activates:

```js
document.querySelector('[data-bs-toggle="tab"]').addEventListener('shown.bs.tab', function() {
    if (!chartRendered) {
        new ApexCharts(el, opts).render();
        chartRendered = true;
    }
});
```

**Charts inside accordions**: same — listen for `shown.bs.collapse`.

**Charts inside offcanvas**: render on `shown.bs.offcanvas`.

**Charts inside htmx-loaded content**: ensure the script runs *after* the swap. Either inline `<script>` in the swap content or `htmx:afterSwap` listener.

## Sortable.js onEnd doesn't persist

### Symptom
Cards drag around fine, but on reload, the order is the original.

### Cause
The `onEnd` callback isn't calling fetch, or the fetch is failing (CSRF, URL, server error).

### Diagnosis
Console: drop a card, watch Network tab. Did a request fire? What was its status?

### Common causes
- **Missing CSRF token**: Sortable's fetch needs `X-CSRFToken` header. The body's `hx-headers` doesn't apply to manual `fetch()`.
- **Wrong URL**: `{% url %}` was rendered server-side correctly?
- **Server returns 4xx**: server-side validation rejecting the move (e.g., user doesn't have permission).

### Fix
Explicit CSRF in fetch:

```js
const csrf = document.querySelector('[name=csrfmiddlewaretoken]').value;
fetch(url, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrf, 'Content-Type': 'application/json' },
    body: JSON.stringify({ card_id, col_id, index })
});
```

Or use htmx's `htmx.ajax`:

```js
htmx.ajax('POST', url, { values: { card_id, col_id, index } });
```

(`htmx.ajax` uses the body's `hx-headers`, so CSRF is included automatically.)

## Django form fields don't have Tabler styling

### Symptom
A `<form>` rendered from Django's `{{ form }}` shows browser-default inputs (no rounded corners, no border, default font).

### Cause
Django widgets don't apply CSS classes by default. Tabler relies on `.form-control` and `.form-select` classes.

### Fix
Add classes in the form's `__init__`:

```python
class MyForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if isinstance(field.widget, forms.Select):
                field.widget.attrs.setdefault('class', 'form-select')
            elif isinstance(field.widget, forms.CheckboxInput):
                field.widget.attrs.setdefault('class', 'form-check-input')
            else:
                field.widget.attrs.setdefault('class', 'form-control')
```

Or use a custom widget mixin. Or use SmallStack's `vTextField`-style helper. See [forms.md](forms.md).

## Tabler JS components don't initialize at all

### Symptom
Even on initial page load, no dropdowns, tabs, or modals work.

### Cause
- Tabler JS didn't load (network error)
- Bootstrap auto-init is disabled
- Another script throws an error before Tabler initializes (check console for red errors)

### Diagnosis
1. Console: red errors before any user interaction? Fix those first.
2. Console: `typeof bootstrap` — should be `"object"`.
3. Network: `tabler.min.js` loaded with 200 status?
4. Console: `bootstrap.Dropdown` — should exist.

### Fix
- Fix prior script errors that may abort init
- Verify Tabler JS loads
- Check for browser extensions that may strip scripts (privacy extensions on dev domains)

## Performance: page feels slow to render

### Common causes
1. Many inline SVG icons in the markup (~1KB each × 50 = 50KB markup)
2. Charts initialized on `DOMContentLoaded` without `animations: { enabled: false }`
3. Tooltips initialized for every cell in a 500-row table
4. Inline scripts blocking parse

### Fix
- For repeated icons, use a sprite sheet or SVG `<use>`
- Set `animations: { enabled: false }` in all dashboard charts
- Initialize tooltips on hover (event delegation) instead of upfront:
  ```js
  document.body.addEventListener('mouseenter', e => {
      if (e.target.matches('[data-bs-toggle="tooltip"]') && !bootstrap.Tooltip.getInstance(e.target)) {
          new bootstrap.Tooltip(e.target).show();
      }
  }, true);
  ```
- Move large inline scripts to external files

## Print preview looks broken

### Symptom
`Ctrl/Cmd+P` shows a print preview with navbar, sidebar, dark backgrounds.

### Cause
Default `@media print` doesn't override dark mode CSS variables.

### Fix
Add to `tabler_overrides.css`:

```css
@media print {
    body, body.theme-dark { background: white !important; color: black !important; }
    .card { border: 1px solid #ddd !important; box-shadow: none !important; }
    .navbar, .footer, .page-header .btn-list, .d-print-none { display: none !important; }
}
```

## Settings panel reset doesn't fully reset

### Symptom
Click "Reset to defaults" — color goes back to amber but layout stays vertical.

### Cause
`resetAll()` should clear all axes. If one is missed, that axis stays.

### Diagnosis
Console after reset: `localStorage` — should have NO `smallstack-*` keys.

### Fix
Verify `resetAll()` in `tabler_theme.js` lines 262-285 removes each key and calls each `apply*()` with the default. Add new axes to the loop if you added new settings.

## Related skills

- [theming.md](theming.md) — the engine and storage keys
- [layouts.md](layouts.md) — for layout-specific issues
- [charts.md](charts.md) — for chart-specific issues
- [htmx-patterns.md](htmx-patterns.md) — for the JS re-init handler
- [customization.md](customization.md) — when you've customized something and broken it
