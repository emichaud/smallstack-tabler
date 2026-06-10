# Tabler Theming — colors, dark mode, settings panel

**Use this skill when** choosing the default accent color, customizing dark mode, debugging theme persistence, adding/removing options from the settings panel, or syncing theme state to the user profile.

## Tabler references

- Docs: https://docs.tabler.io/ui/base/colors — the full color palette
- Docs: https://docs.tabler.io/ui/base/dark-mode — Tabler's dark-mode contract
- Docs: https://docs.tabler.io/ui/base/css-variables — every Tabler CSS variable

## In-repo files

- `apps/tabler/templates/tabler/base.html` — blocking theme script (lines 10-26, 47-57); FOUC prevention
- `apps/tabler/templates/tabler/includes/settings.html` — the offcanvas panel HTML (all radio inputs)
- `apps/tabler/static/tabler/css/tabler_overrides.css` — every dark-mode override and color-scheme polish
- `apps/tabler/static/tabler/js/tabler_theme.js` — the theme engine (370 lines, well-commented)
- `apps/profile/` — `UserProfile.theme_preference` field, persisted from the engine

## Mental model

There are **five independent theme axes**, each persisted in its own `localStorage` key under the `smallstack-` prefix:

| Axis | Values | localStorage key | DOM effect |
|------|--------|------------------|-----------|
| **theme** (color mode) | `dark`, `light` | `smallstack-theme` | `body.theme-dark` class + `data-bs-theme` on `<html>` |
| **color** (accent) | amber, blue, azure, indigo, purple, pink, red, orange, green, teal, cyan | `smallstack-color` | `--tblr-primary` and `--tblr-primary-rgb` set on `<html>`; for non-amber, dynamic `<style id="stk-dynamic-btn-css">` is injected |
| **font** | `sans-serif`, `serif`, `monospace`, `comic` | `smallstack-font` | `data-bs-theme-font` attribute on `<html>` |
| **base** (gray palette) | `gray`, `slate`, `zinc`, `neutral`, `stone` | `smallstack-base` | `data-bs-theme-base` attribute on `<html>` |
| **radius** (corner) | `0`, `0.5`, `1`, `1.5`, `2` | `smallstack-radius` | `data-bs-theme-radius` attribute on `<html>` |
| **layout** | `default`, `boxed`, `condensed`, `fluid`, `navbar-dark`, `navbar-overlap`, `navbar-sticky`, `vertical`, `vertical-right`, `rtl` | `smallstack-layout` | See [layouts.md](layouts.md) |

The engine never combines these — each is set independently and rendered with multiple CSS selectors stacking.

## The 11 accent colors

| Name | Hex | Tone |
|------|-----|------|
| `amber` (default) | `#f59f00` | Warm gold |
| `blue` | `#206bc4` | Classic corporate |
| `azure` | `#4299e1` | Light, friendly |
| `indigo` | `#4263eb` | Deep blue-purple |
| `purple` | `#ae3ec9` | Vibrant |
| `pink` | `#d6336c` | Hot pink |
| `red` | `#d63939` | Alert/danger |
| `orange` | `#f76707` | Energetic |
| `green` | `#2fb344` | Success/growth |
| `teal` | `#0ca678` | Cool green |
| `cyan` | `#17a2b8` | Info blue |

Plus the **full Tabler palette** is also available as utility classes — `text-yellow`, `bg-lime-lt`, `btn-yellow`, etc. See [components.md](components.md) for the full named-color list.

## Changing the default accent

Edit `apps/tabler/static/tabler/css/tabler_overrides.css`, lines 7-11:

```css
:root {
    --tblr-primary: #4263eb;       /* indigo */
    --tblr-primary-rgb: 66, 99, 235;
    --tblr-font-sans-serif: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --tblr-code-color: #4263eb;
}
```

And update the JS default in `apps/tabler/static/tabler/js/tabler_theme.js` line 23:

```js
var defaults = {
    theme: 'dark',
    color: 'indigo',   // ← here
    ...
};
```

Both must match or the engine will override the CSS at boot. Clear `localStorage` after the change to test (`localStorage.removeItem('smallstack-color')`).

## Dark mode internals

Dark mode is activated by two simultaneous signals:

1. `body.theme-dark` class — for all custom selectors in `tabler_overrides.css`
2. `data-bs-theme="dark"` attribute on `<html>` — for Tabler's own selectors

The **blocking script** in `tabler/base.html` (lines 10-26) sets both *before* the page paints, eliminating the flash-of-light-theme. A second inline script in `<body>` (lines 47-57) re-applies the class once the body element exists, because some browsers haven't created `document.body` when the first `<head>` script runs.

### Adding dark-mode styles for new components

Tabler's variables (`--tblr-card-bg`, `--tblr-border-color`, `--tblr-muted`, etc.) already adapt — most of the time you don't need to write anything. When you do, scope under `body.theme-dark`:

```css
body.theme-dark .my-custom-thing {
    background-color: var(--tblr-card-bg);
    border-color: var(--tblr-border-color);
    color: var(--tblr-body-color);
}
```

Prefer Tabler variables over hex codes. The dark palette is defined in `tabler_overrides.css` lines 19-31:

```css
[data-bs-theme='dark'] {
    --tblr-gray-50:  #f8f9fa;
    --tblr-gray-100: #e9ecef;
    --tblr-gray-200: #c8ccd4;   /* primary text */
    --tblr-gray-300: #a0a4ab;
    --tblr-gray-400: #656d77;   /* muted text */
    --tblr-gray-500: #3a3d44;
    --tblr-gray-600: #2c2e34;   /* border */
    --tblr-gray-700: #212329;   /* card background */
    --tblr-gray-800: #1a1c23;   /* page background */
    --tblr-gray-900: #151820;
    --tblr-gray-950: #101218;
}
```

And the role mapping at lines 33-45:

```css
body.theme-dark {
    --tblr-body-bg:           var(--tblr-gray-800);
    --tblr-bg-surface:        var(--tblr-gray-700);
    --tblr-card-bg:           var(--tblr-gray-700);
    --tblr-body-color:        var(--tblr-gray-200);
    --tblr-border-color:      var(--tblr-gray-600);
    --tblr-border-color-light:var(--tblr-gray-500);
    --tblr-nav-link-color:    var(--tblr-gray-200);
    --tblr-muted:             var(--tblr-gray-400);
}
```

## The theme engine API

`tabler_theme.js` exposes `window.SmallStackTheme`:

```js
SmallStackTheme.applyTheme('light');     // dark|light
SmallStackTheme.applyColor('indigo');    // any of the 11
SmallStackTheme.applyFont('serif');      // sans-serif|serif|monospace|comic
SmallStackTheme.applyBase('slate');      // gray|slate|zinc|neutral|stone
SmallStackTheme.applyRadius('0');        // 0|0.5|1|1.5|2
SmallStackTheme.applyLayout('vertical'); // see layouts.md
SmallStackTheme.get('color');            // read current value
SmallStackTheme.reset();                 // clear all and re-apply defaults
```

Each `apply*` call:
1. Writes to `localStorage`
2. Updates the DOM (class, attribute, or CSS var)
3. For the `theme` axis: also POSTs to `/profile/theme/` via htmx, persisting to the user's `UserProfile`

## Color application is dynamic, not static

For accent colors other than amber, the engine **generates a `<style id="stk-dynamic-btn-css">`** at runtime (`tabler_theme.js` lines 90-141). This is because Tabler's `.btn-primary`, `.btn-warning`, link colors, focus rings, and many other touchpoints are normally baked into the compiled CSS as `#f59f00`. The dynamic style overrides them per-page-load.

Things the dynamic style sets:
- `.btn-primary`, `.btn-warning` background, border, text color (with `!important`)
- `.btn-outline-primary` border + hover
- All in-card content links (excluding `.btn`, `.nav-link`, `.dropdown-item`)
- Active tabs, active navbar items
- `.form-control:focus`, `.form-select:focus` border + focus ring (`box-shadow`)
- `.text-amber`, `.bg-amber`, `.text-primary`, `.bg-primary`
- Progress bars, slide content, slide progress bar

If you add a new component that should respect the accent color, **either**:
- Use `var(--tblr-primary)` directly (the CSS var is always current)
- **Or** add a selector to the template literal in `applyColor()` so the dynamic style covers it

## The settings panel

`tabler/includes/settings.html` is an offcanvas at `#offcanvas-settings`, triggered by the gear icon in the navbar. It's just radio inputs; the engine listens for `change` events.

### Adding a new setting

Three places to update:

1. **`settings.html`** — add a new `<label class="form-check">` block under a new `<label class="form-label">`. Use a `name="stk-<axis>"` radio group.
2. **`tabler_theme.js`** — add the key to `defaults`, write an `apply<Axis>(value)` function, hook it into the `change` listener, the `init()` function, the `syncPanel()` function, and `resetAll()`.
3. **`tabler_overrides.css`** — add the CSS selectors that respond to the new attribute/class.

### Removing the settings panel from a page

Override the entire base — but easier: just hide the gear icon by replacing the navbar:

```django
{% block navbar %}
  {% include "tabler/includes/navbar.html" with show_settings=False %}
{% endblock %}
```

(You'd need to add a `{% if show_settings %}` around the gear icon in `navbar.html`.) Simpler approach: remove the include from the page's base entirely, or hide it with CSS scoped to a `body_class`.

## Syncing to user profile

For authenticated users, `applyTheme()` POSTs to `/profile/theme/` (handled by `apps/profile/views.py`) so the choice persists across browsers and devices. The view writes to `UserProfile.theme_preference`. On login, the page-load script reads this value from a server-rendered hidden input or falls back to `localStorage`.

To **disable** the cross-device sync: comment out the `htmx.ajax` call at lines 82-87 of `tabler_theme.js`. Theme will still persist per-browser via `localStorage`.

## Custom palette: changing the base gray

The `base` axis swaps the entire gray palette. Each value (`slate`, `zinc`, `neutral`, `stone`) maps to a different `[data-bs-theme-base]` block in `tabler_overrides.css`. To add a new one (e.g., `warm`):

1. Add `<input type="radio" name="stk-base" value="warm">` to `settings.html`
2. Add `[data-bs-theme-base='warm'] { --tblr-gray-50: ...; ... --tblr-gray-950: ...; }` to `tabler_overrides.css`
3. The engine already handles arbitrary values — no JS change needed unless you want a different default

## Migration notes (for legacy localStorage)

The engine handles a few legacy keys (see `tabler_theme.js` `init()` lines 288-300):

- `smallstack-navbar=side` → migrated to `smallstack-layout=vertical`
- `smallstack-layout=sticky` → migrated to `smallstack-layout=navbar-sticky`

If you change the engine schema again, add a similar migration block — never silently break existing users' persisted preferences.

## Gotchas

- **Changing the default in CSS without changing JS will lose the new default after one user interaction.** The engine writes the JS default to `localStorage` on first load, then reads from there. CSS and JS defaults must match.
- **Don't read `--tblr-primary` synchronously in `extra_css` `<style>` blocks** — CSS vars work fine in CSS but the initial paint may use stale values before `applyColor()` runs. For JS that reads it (e.g., chart colors), use `getComputedStyle(document.documentElement).getPropertyValue('--tblr-primary').trim()` *after* `DOMContentLoaded`.
- **The blocking script in `<head>` references `document.body`** — if it doesn't exist yet, it falls back to a `DOMContentLoaded` listener. Don't reorder.
- **Settings panel radios are synced one-way** — engine → panel via `syncPanel()`. If you mutate radios programmatically (rare), call `syncPanel()` afterward.
- **HTMX swaps that replace the navbar will break the settings gear** — the offcanvas content (`#offcanvas-settings`) is in `<body>` directly, not inside the navbar, so it survives navbar swaps. The trigger anchor inside the navbar, though, would need to survive — prefer not htmx-swapping the navbar.
- **`localStorage` is per-origin** — if a user visits both `localhost:8005` and `localhost:8007`, they have independent theme prefs. This is correct, just be aware when debugging.

## Related skills

- [foundations.md](foundations.md) — the base template that loads all this
- [layouts.md](layouts.md) — the layout axis is also driven by the settings engine
- [charts.md](charts.md) — for chart color reading patterns (`getComputedStyle`)
- [customization.md](customization.md) — to add new settings or remove existing ones
- [troubleshooting.md](troubleshooting.md) — FOUC, theme-not-persisting, color-not-applying
