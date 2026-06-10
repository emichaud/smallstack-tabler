# Tabler Layouts — picking horizontal vs vertical vs boxed, etc.

**Use this skill when** choosing the page layout for an app, hard-coding a layout per-app, or implementing a layout variant that's not currently supported.

## Tabler references

- Docs: https://docs.tabler.io/ui/layout/page — page wrapper variants
- Docs: https://docs.tabler.io/ui/layout/navbar — navbar position options
- Preview gallery: https://preview.tabler.io — every layout demo:
  - https://preview.tabler.io/index.html (horizontal default)
  - https://preview.tabler.io/layout-vertical.html (left sidebar)
  - https://preview.tabler.io/layout-vertical-right.html (right sidebar)
  - https://preview.tabler.io/layout-boxed.html
  - https://preview.tabler.io/layout-condensed.html
  - https://preview.tabler.io/layout-fluid.html
  - https://preview.tabler.io/layout-navbar-sticky.html
  - https://preview.tabler.io/layout-navbar-overlap.html
  - https://preview.tabler.io/layout-navbar-dark.html
  - https://preview.tabler.io/layout-rtl.html

## In-repo files

- `apps/tabler/templates/tabler/base.html` lines 47-57 — body class application (boxed/condensed/fluid)
- `apps/tabler/static/tabler/js/tabler_theme.js` lines 173-237 — `applyLayout()` switch statement
- `apps/tabler/static/tabler/css/tabler_overrides.css` — layout-specific selectors (search for `.layout-boxed`, `.navbar-side`, `.navbar-sticky`, `.navbar-overlap`)
- `apps/tabler/templates/tabler/includes/settings.html` lines 203-267 — radio inputs for each layout option

## Layout matrix

| Value | Effect | Use for |
|-------|--------|---------|
| `default` | Horizontal navbar at top, content below. The classic dashboard layout. | Most admin pages. The default. |
| `boxed` | Adds `.layout-boxed` to `<body>` — max-width centered with side margins. | Marketing-adjacent admin pages where you want a "page" feel. |
| `condensed` | Adds `.layout-condensed` to `<body>` — tighter spacing throughout. | Information-dense dashboards, log viewers, ops consoles. |
| `fluid` | Adds `.layout-fluid` to `<body>` — full-width, container removed. | Wide tables, kanban boards, edge-to-edge dashboards. |
| `navbar-dark` | Sets `data-bs-theme="dark"` on the navbar only (rest of page stays light/dark per `theme`). | Brand effect — dark navbar against light page. |
| `navbar-overlap` | Adds `.navbar-overlap` — navbar floats over the page-header background. | Hero-style pages with imagery behind the navbar. |
| `navbar-sticky` | Adds `.navbar-sticky` — navbar stays visible on scroll. | Long pages where users need persistent nav. |
| `vertical` | Adds `.navbar-side` to `.page` — sidebar nav on the left, content fills right. | Apps with many primary destinations. |
| `vertical-right` | `.navbar-side` + `.navbar-side-end` — same but on the right. | RTL apps or designer preference. |
| `rtl` | Sets `dir="rtl"` on `<html>`. | Right-to-left languages (Arabic, Hebrew, Farsi). |

These are **not exclusive** in CSS terms, but the engine sets only one at a time. To combine (e.g., vertical + condensed), see "Hard-coding layouts" below.

## Letting the user pick

Default behavior: the settings panel offers all 10 options as radios, the engine persists the choice to `localStorage`, and the page applies it on every load. No work required.

## Hard-coding a layout for an app

If a specific app should always use a particular layout regardless of the user's setting, override the body class or page class in a per-app base template:

```django
{# apps/myapp/templates/myapp/_base.html #}
{% extends "tabler/base.html" %}

{% block body_class %}layout-fluid{% endblock %}
```

Now every template in your app extends `myapp/_base.html`. The user's `localStorage` `smallstack-layout` setting will still be written to `<body>` by the inline script, but adding your class on top is harmless — the CSS wins via cascade.

For a vertical-only app, you need to also add the class to `.page`:

```django
{# apps/myapp/templates/myapp/_base.html #}
{% extends "tabler/base.html" %}

{% block extra_css %}
<script>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.page')?.classList.add('navbar-side');
});
</script>
{% endblock %}
```

(A `<script>` inside `extra_css`-named block is fine — it's just placement; the block runs in `<head>`.)

## Vertical (sidebar) layout

The "vertical" layout converts the horizontal navbar into a left sidebar. Implementation lives in `tabler_theme.js` `applyLayout()`:

```js
case 'vertical':
    if (page) page.classList.add('navbar-side');
    break;
```

CSS in `tabler_overrides.css` handles:
- Flexbox row direction on `.page.navbar-side`
- Fixed-width sidebar (240-260px depending on viewport)
- Stacking the brand, content nav, and right-side items vertically
- Mobile collapse (becomes off-canvas below `md` breakpoint)

**Vertical-right** layout adds `.navbar-side-end` which simply moves the sidebar to the right via flex order.

### Wide vs narrow sidebar

Tabler supports a condensed (icon-only) sidebar via the `.navbar-vertical-condensed` class. To enable this in combination with `vertical`:

```js
// in applyLayout, after page.classList.add('navbar-side')
if (someCondition) navbar.classList.add('navbar-vertical-condensed');
```

Not currently wired into the settings panel — could be added as a new axis (`smallstack-sidebar-width`).

## Boxed layout

`.layout-boxed` adds a max-width wrapper around the whole page (`~1280px`) with side margins. Used in marketing-style admin pages, "card surrounding the page" effects.

Combine with **`navbar-overlap`** for a hero-image effect:

```django
{% block body_class %}layout-boxed{% endblock %}
{% block extra_css %}
<script>
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.navbar')?.classList.add('navbar-overlap');
});
</script>
{% endblock %}
```

## Condensed layout

`.layout-condensed` reduces:
- Card padding (`--tblr-card-padding-y`, `--tblr-card-padding-x`)
- Row gutters
- Page-header padding
- Form-control padding

Good for power-user dashboards. Heartbeat's monitoring views, activity request logs, and explorer's table-heavy pages are good candidates.

## Fluid layout

`.layout-fluid` removes the `.container-xl` max-width. Content goes edge-to-edge. Combine with `card-table` and wide multi-column grids:

```django
{% block body_class %}layout-fluid{% endblock %}
{% block content %}
<div class="row row-deck row-cards">
  <div class="col-12">
    <div class="card">
      <div class="card-table">
        <table class="table"> <!-- spans entire viewport --> </table>
      </div>
    </div>
  </div>
</div>
{% endblock %}
```

## Sticky / overlap navbar

`.navbar-sticky` uses `position: sticky; top: 0` so the navbar stays at the top of the viewport during scroll. Z-index already handled by Tabler.

`.navbar-overlap` removes the navbar's background so the page-header bleeds underneath. Use with a colored or imaged `.page-header`:

```django
{% block page_header %}
<div class="page-header" style="background: linear-gradient(135deg, #f59f00, #d6336c); color: white; padding-top: 6rem;">
  <div class="container-xl">
    <h1>Welcome</h1>
  </div>
</div>
{% endblock %}
```

## RTL mode

Setting `dir="rtl"` on `<html>` flips Bootstrap 5 RTL classes (which Tabler inherits). Text, padding, and margin all mirror. Works out of the box for most components.

**Caveats**:
- Inline `style="margin-left: ..."` won't mirror — always use Bootstrap utility classes (`ms-*`, `me-*`) which respect `dir`.
- Inline SVG icons with directional meaning (arrows, chevrons) don't auto-flip. Wrap them and use `transform: scaleX(-1)` under `[dir='rtl']`.

## Combining layouts

The engine sets only one layout at a time, but the CSS classes are independent. To combine:

```django
{% block body_class %}layout-condensed layout-boxed{% endblock %}
```

Or via JS on a per-page basis:

```django
{% block extra_js %}
<script>
document.body.classList.add('layout-condensed');
document.querySelector('.navbar')?.classList.add('navbar-sticky');
</script>
{% endblock %}
```

## Print layout

Tabler's `.d-print-none` class is applied to the navbar, page-header action buttons, and footer by default. The page-body and content render. To customize print:

```css
@media print {
  .d-print-none { display: none !important; }
  .page-body { padding: 0; }
  .card { box-shadow: none !important; border: 1px solid #ddd !important; }
}
```

(Add to `tabler_overrides.css` for global, or to `{% block extra_css %}` for per-page.)

## Mobile / responsive

All layouts are responsive. Key breakpoints:
- `xs` <576
- `sm` ≥576
- `md` ≥768 (navbar uncollapses)
- `lg` ≥992
- `xl` ≥1200
- `xxl` ≥1400

The vertical sidebar layout auto-becomes off-canvas at `<md`. The horizontal navbar collapses to a hamburger menu.

For a per-page mobile-specific layout adjustment:

```django
{% block extra_css %}
<style>
@media (max-width: 767.98px) {
  .my-desktop-only { display: none !important; }
  .my-mobile-stack { flex-direction: column !important; }
}
</style>
{% endblock %}
```

## Gotchas

- **Vertical layout requires `.page` to have `.navbar-side`** — `tabler_overrides.css` only styles `.page.navbar-side .navbar`, so adding only to `.navbar` will not work.
- **Layout migrations:** legacy `smallstack-navbar=side` is migrated to `smallstack-layout=vertical` at boot (see `tabler_theme.js` lines 288-300). If you rename a layout value, add a migration.
- **The blocking script in base.html doesn't handle vertical** — `vertical` requires DOM manipulation of `.page` and `.navbar` that those scripts can't do before render. There's a brief flash where horizontal layout appears before `applyLayout('vertical')` runs after Tabler JS loads. Acceptable trade-off given the engine architecture.
- **Combining `vertical` + `navbar-overlap` doesn't work** — the engine clears layout classes from `.navbar` and `.page` before each `apply`. To force a combo, hard-code via per-app base.
- **`layout-fluid` removes max-width even from the footer** — usually fine. If the footer feels too wide, wrap its content in a `.container-xl`.
- **The settings panel doesn't currently expose every combination** (e.g., no "condensed + vertical" radio). Users can chain by changing one then the other — both `localStorage` keys persist.

## Related skills

- [theming.md](theming.md) — for the engine that drives layout selection
- [foundations.md](foundations.md) — for the page-wrapper structure (`.page`, `.page-wrapper`, `.page-header`, `.page-body`)
- [page-dashboards.md](page-dashboards.md) — for which layout suits which dashboard style
- [page-landing.md](page-landing.md) — for boxed/overlap landing-page patterns
- [customization.md](customization.md) — to add new layouts (e.g., condensed + vertical combo, narrow sidebar)
