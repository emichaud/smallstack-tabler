# Customization — overrides, extending, plugins, local build

**Use this skill when** changing Tabler defaults, extending the base template, integrating a new plugin, switching to a local Tabler build, or handling Content-Security-Policy concerns.

## Tabler references

- Docs: https://docs.tabler.io/getting-started/customizing — official customization guide
- Tabler source: https://github.com/tabler/tabler

## In-repo files

- `apps/tabler/templates/tabler/base.html` — base to extend or fork
- `apps/tabler/static/tabler/css/tabler_overrides.css` — primary CSS override file
- `apps/tabler/static/tabler/js/tabler_theme.js` — theme engine to extend with new axes
- `_tabler_source/` — full Tabler npm source (for reference, not active)

## The three customization layers

When tuning Tabler, choose the lowest-cost layer that works:

1. **CSS variables in `:root`** — easiest, works at runtime
2. **CSS overrides in `tabler_overrides.css`** — when variables don't cover it
3. **Forking `tabler/base.html` or partials** — when structure must change

Prefer (1). Resort to (3) only when content/order must change.

## Layer 1 — CSS variable tuning

Tabler exposes hundreds of CSS variables. The most useful for app-wide tuning:

```css
:root {
    /* Accent */
    --tblr-primary: #f59f00;
    --tblr-primary-rgb: 245, 159, 0;

    /* Type */
    --tblr-font-sans-serif: 'Inter', ...;
    --tblr-font-serif: 'Source Serif Pro', ...;
    --tblr-font-monospace: 'JetBrains Mono', ...;

    /* Sizes */
    --tblr-font-size-base: 0.875rem;
    --tblr-line-height-base: 1.5;
    --tblr-border-radius: 4px;
    --tblr-border-radius-lg: 8px;

    /* Spacing */
    --tblr-spacer: 1rem;

    /* Components */
    --tblr-card-bg: white;
    --tblr-card-border-color: var(--tblr-border-color);
    --tblr-card-spacer-y: 1.25rem;
    --tblr-card-spacer-x: 1.5rem;
    --tblr-card-cap-bg: transparent;

    /* Code */
    --tblr-code-color: #f59f00;
    --tblr-code-bg: rgba(245, 159, 0, 0.08);
}
```

Edit `tabler_overrides.css` lines 7-16 to change the defaults.

For dark mode specifically, override under `body.theme-dark`:

```css
body.theme-dark {
    --tblr-card-bg: var(--tblr-gray-700);
    --tblr-border-color: var(--tblr-gray-600);
    /* ... see lines 33-45 for full list */
}
```

## Layer 2 — CSS overrides

When variables don't expose the knob you need, write a class override:

```css
/* New: a "highlighted" card variant */
.card-highlighted {
    border: 2px solid var(--tblr-primary);
    box-shadow: 0 0 0 4px rgba(var(--tblr-primary-rgb), 0.12);
}
body.theme-dark .card-highlighted {
    box-shadow: 0 0 0 4px rgba(var(--tblr-primary-rgb), 0.2);
}
```

Add to `tabler_overrides.css` (preferred for global) or to a page's `{% block extra_css %}` (for one-off).

### Override Tabler's defaults via specificity

When you need to override a Tabler class, beat its specificity:

```css
/* Tabler defines .card with --tblr-card-bg as background */
.card { background-color: var(--tblr-card-bg); }

/* Yours wins if you select at the same level + !important, or higher specificity */
.card.is-elevated {
    background: var(--tblr-card-bg);
    box-shadow: var(--tblr-box-shadow-lg);
}
```

Avoid `!important` unless overriding a `tabler_theme.js`-injected dynamic style (which uses `!important` itself — `applyColor()` in `tabler_theme.js`).

## Layer 3 — Forking the base template

When you need to change blocks, includes, or asset loading, override the entire base for your section:

### Option A — Project-wide change

Edit `apps/tabler/templates/tabler/base.html` directly. Commit the change. All apps using `{% extends "tabler/base.html" %}` get it.

### Option B — Per-app base

Create `apps/myapp/templates/myapp/_base.html` that extends `tabler/base.html` but adds blocks:

```django
{# myapp/_base.html #}
{% extends "tabler/base.html" %}

{% block extra_css %}
<link rel="stylesheet" href="{% static 'myapp/css/myapp.css' %}">
{{ block.super }}
{% endblock %}

{% block body_class %}myapp-section{{ block.super }}{% endblock %}
```

Then in views: `{% extends "myapp/_base.html" %}`.

### Option C — Separate base entirely

For marketing pages or special sections that need a completely different structure, create a new base file in `apps/myapp/templates/` that does NOT extend `tabler/base.html` but loads Tabler assets independently.

Example: `apps/tabler/templates/registration/tabler_auth_base.html` is exactly this — a standalone base for auth pages with no navbar.

## Adding a new template block

To support customization in your base, add named blocks that extending templates can override:

```django
{# tabler/base.html #}
<body>
    {% block navbar %}{% include "tabler/includes/navbar.html" %}{% endblock %}
    {% block sub_navbar %}{% endblock %}   {# ← new #}
    <div class="page-wrapper">
        {% block before_breadcrumbs %}{% endblock %}   {# ← new #}
        {% block breadcrumbs %}{% endblock %}
        ...
    </div>
</body>
```

Document any new blocks in [foundations.md](foundations.md).

## Integrating a new plugin

Pattern for adding any new third-party JS plugin:

### 1. Load assets per-page

```django
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/some-plugin/dist/style.css">
{% endblock %}

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/some-plugin/dist/some-plugin.min.js"></script>
<script>
new SomePlugin('#my-target', { /* config */ });
</script>
{% endblock %}
```

Only load on pages that need it. Don't bake into `base.html`.

### 2. Style it for dark mode

```css
/* In extra_css or a per-app CSS file */
body.theme-dark .some-plugin-class {
    background: var(--tblr-card-bg);
    color: var(--tblr-body-color);
    border-color: var(--tblr-border-color);
}
```

### 3. Track the accent color

If the plugin has a primary color, read it at runtime:

```js
const primary = getComputedStyle(document.documentElement)
    .getPropertyValue('--tblr-primary').trim();
new SomePlugin('#x', { color: primary });
```

If the plugin has its own settings panel concept, hook into `SmallStackTheme.applyColor` extension — see [theming.md](theming.md).

### 4. Re-init after htmx swap

If users will trigger htmx swaps that replace plugin containers, re-init in the `htmx:afterSwap` listener — see [htmx-patterns.md](htmx-patterns.md).

### 5. Document it

If the plugin is going to be reused across the app, add it to the appropriate skill file (`forms.md`, `charts.md`, etc.).

## Switching to a local Tabler build (off CDN)

The CDN is convenient but adds an external dependency. To self-host:

### Quick: download the minified files

```bash
mkdir -p smallstack-tabler/apps/tabler/static/tabler/vendor
cd smallstack-tabler/apps/tabler/static/tabler/vendor
curl -O https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler.min.css
curl -O https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/css/tabler-themes.min.css
curl -O https://cdn.jsdelivr.net/npm/@tabler/core@1.4.0/dist/js/tabler.min.js
```

Update `tabler/base.html`:

```django
<link rel="stylesheet" href="{% static 'tabler/vendor/tabler.min.css' %}">
<link rel="stylesheet" href="{% static 'tabler/vendor/tabler-themes.min.css' %}">
...
<script src="{% static 'tabler/vendor/tabler.min.js' %}"></script>
```

### Full: build from source

Use the source in `_tabler_source/` (already vendored):

```bash
cd _tabler_source/core
npm install
npm run build
# Output → dist/
```

Customize SCSS variables before building:

```scss
// _tabler_source/core/src/scss/_variables.scss
$primary: #4263eb;  // change default
```

This gives you a Tabler build with custom defaults baked in — but you lose CDN caching benefits.

## Adding a new theme axis

To add (e.g.) a sidebar-width setting that persists like color/font/base:

### 1. Add radio inputs to `settings.html`

```html
<div class="mb-4">
    <label class="form-label">Sidebar width</label>
    <label class="form-check">
        <input type="radio" name="stk-sidebar" value="narrow" class="form-check-input">
        <div class="form-check-label">Narrow</div>
    </label>
    <label class="form-check">
        <input type="radio" name="stk-sidebar" value="wide" class="form-check-input">
        <div class="form-check-label">Wide</div>
    </label>
</div>
```

### 2. Wire to engine in `tabler_theme.js`

```js
var defaults = { ..., sidebar: 'narrow' };

function applySidebar(value) {
    set('sidebar', value);
    if (value === defaults.sidebar) {
        document.documentElement.removeAttribute('data-bs-sidebar');
    } else {
        document.documentElement.setAttribute('data-bs-sidebar', value);
    }
}

// In init():
applySidebar(get('sidebar'));

// In syncPanel():
'stk-sidebar': get('sidebar')

// In change listener:
else if (target.name === 'stk-sidebar') applySidebar(target.value);

// In resetAll():
applySidebar(defaults.sidebar);

// Expose:
window.SmallStackTheme.applySidebar = applySidebar;
```

### 3. Add CSS in `tabler_overrides.css`

```css
[data-bs-sidebar='wide'] .page.navbar-side .navbar {
    width: 320px;
}
[data-bs-sidebar='wide'] .page.navbar-side .page-wrapper {
    margin-left: 320px;
}
```

## Customizing the navbar

Edit `apps/tabler/templates/tabler/includes/navbar.html` directly. Common changes:

- Replace the logo SVG with `<img src="{% static brand.logo %}">`
- Add/remove dropdown items from the Help dropdown
- Add a new section (e.g., a global search bar) before the right-side icons
- Swap the apps-grid for a vertical sidebar nav

Test on both authenticated and unauthenticated routes (the right-side blocks vary).

## Customizing the footer

The footer is inline in `tabler/base.html` (lines 84-103). To make it configurable:

### Option A — Direct edit

Edit the inline markup.

### Option B — Make it a block + include

```django
{# tabler/base.html #}
<footer class="footer footer-transparent d-print-none">
    {% block footer %}
    {% include "tabler/includes/footer.html" %}
    {% endblock %}
</footer>
```

Then create `tabler/includes/footer.html` and override per-page or per-app.

## Removing the cookie banner

It's `{% include "tabler/includes/cookie_banner.html" %}` in `base.html`. Either:

- Delete the include line
- Or guard it: `{% if brand.cookie_banner.enabled %}{% include ... %}{% endif %}` and toggle via `BRAND_COOKIE_BANNER` setting.

## Removing the settings panel

`{% include "tabler/includes/settings.html" %}` — comment out the include and the gear icon in the navbar.

Note: the theme engine (`tabler_theme.js`) still runs and reads `localStorage`; just the panel is gone. Users can still set theme via the `SmallStackTheme.applyTheme()` JS API or via the profile edit page.

## CSP (Content Security Policy)

If you enable CSP headers (in `MIDDLEWARE` or via a reverse proxy), Tabler needs:

- `script-src` — CDN (`cdn.jsdelivr.net`), inline scripts (the FOUC blockers in base.html) — needs `'unsafe-inline'` or nonces
- `style-src` — CDN, inline `<style>` blocks — needs `'unsafe-inline'` or nonces
- `font-src` — `fonts.googleapis.com`, `fonts.gstatic.com`
- `img-src` — `data:` for inline-image previews; CDN if loading from Tabler's static assets
- `connect-src` — any API endpoints + ApexCharts may attempt analytics requests

Example CSP for production:

```python
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net")
CSP_STYLE_SRC  = ("'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "fonts.googleapis.com")
CSP_FONT_SRC   = ("'self'", "fonts.gstatic.com")
CSP_IMG_SRC    = ("'self'", "data:")
```

For stricter CSP without `'unsafe-inline'`, move all inline scripts (FOUC blockers, settings reset, etc.) to external files. Significant refactor.

## Print stylesheets

`d-print-none` is applied to navbar, footer, action buttons by default. To add a custom print stylesheet:

```css
@media print {
    body { background: white !important; color: black !important; font-family: Georgia, serif; }
    body.theme-dark { background: white !important; color: black !important; }
    .card { border: 1px solid #ddd !important; box-shadow: none !important; break-inside: avoid; }
    .table { border-collapse: collapse; }
    .table th, .table td { border: 1px solid #ddd !important; }
    a::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #666; }
}
```

Add to `tabler_overrides.css`.

## Email-template re-use of Tabler styles

For transactional emails (signup confirm, password reset), Tabler isn't designed — email clients are picky about CSS. Use [django-mjml](https://github.com/liminspace/django-mjml) or simple table-based templates.

Don't try to `{% extends "tabler/base.html" %}` from an email template.

## Internationalization

Tabler doesn't bundle translations — most strings come from your templates. Use Django's `{% trans %}` / `{% blocktrans %}` tags:

```django
{% load i18n %}
<button class="btn btn-primary">{% trans "Save" %}</button>
```

RTL languages: enable via the layout setting (`smallstack-layout=rtl`). See [layouts.md](layouts.md).

## Performance: CDN considerations

The CDN URLs in `base.html` resolve to multiple edge servers. To control this:

- **Subresource integrity (SRI)**: Add `integrity="sha384-..."` to the `<link>` and `<script>` tags to verify the file hasn't been tampered with.
- **Local fallback**: Use a JS loader that detects CDN failure and falls back to a local copy.
- **HTTP/2 push or preload**: Add `<link rel="preload">` for Tabler's CSS to start fetching earlier.

For high-stakes production, self-host (see "Switching to local build").

## Gotchas

- **Don't edit `node_modules` or `_tabler_source/`** — those should remain pristine references. Custom CSS goes in `tabler_overrides.css`.
- **CSS variable defaults defined in `:root` apply globally** — if you redefine `--tblr-primary` inside a component, that component takes the new value but nothing else does. Use scoped variables (`--my-component-color`) for localized changes.
- **Bootstrap 5 utility classes can be customized** via [Bootstrap's utilities API](https://getbootstrap.com/docs/5.3/utilities/api/), but that requires a SCSS build. Easier: write a one-off class in `tabler_overrides.css`.
- **Adding a new font** via Google Fonts: add the `<link>` to `tabler/base.html` `<head>`, then set `--tblr-font-sans-serif` to use it. Don't forget to add it as a `data-bs-theme-font` option if you want runtime switching.
- **Removing CDN dependence** breaks updates — pin the version, document the update process, schedule periodic checks for security advisories.
- **The blocking script in `base.html`** reads `localStorage`. If you change the storage prefix (`smallstack-`), update all six places it appears in `base.html` and `tabler_theme.js`.

## Related skills

- [foundations.md](foundations.md) — for the page architecture you're customizing
- [theming.md](theming.md) — for the theme engine you're extending
- [layouts.md](layouts.md) — for adding new layout variants
- [troubleshooting.md](troubleshooting.md) — when customizations break
- [../upstream-workflow.md](../upstream-workflow.md) — for merging upstream SmallStack changes after customizing
