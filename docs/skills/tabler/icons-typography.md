# Icons & Typography — Tabler icons, type scale, code blocks, markdown

**Use this skill when** picking an icon, sizing/coloring it, animating it, picking a heading style, formatting code blocks, or rendering markdown.

## Tabler references

- Icon search & copy: https://tabler.io/icons — 5000+ stroke icons, click any to copy SVG
- Docs: https://docs.tabler.io/ui/typography
- Docs: https://docs.tabler.io/ui/icons

## Tabler Icons

All icons are **inline SVGs** with the same shape:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     class="icon">
  <path d="..."/>
</svg>
```

The `stroke="currentColor"` means the icon takes the text color of its container — so `<span class="text-red"><svg class="icon">...</svg></span>` is a red icon.

### Finding an icon

1. Go to https://tabler.io/icons
2. Search by name or browse categories
3. Click an icon → "Copy SVG" → paste into your template

You can also copy "JSX" if you're going to a React component, or "data URI" for CSS backgrounds.

### Sizes

| Class | Size |
|-------|------|
| `icon-xs` | 16px |
| `icon-sm` | 20px |
| `icon` (default) | 24px |
| `icon-md` | 32px |
| `icon-lg` | 40px |
| `icon-xl` | 48px |
| `icon-2xl` | 64px |

Or set `width` / `height` attributes directly.

### Colors

Wrap or set `color`:

```html
<span class="text-red"><svg class="icon">...</svg></span>
<svg class="icon text-primary">...</svg>
<svg class="icon" style="color: #d6336c">...</svg>
```

### Animations

Add these classes to the `<svg>` (or wrap it):
- `icon-pulse` — gentle scale pulse
- `icon-tada` — wiggle bounce
- `icon-rotate` — continuous rotation

```html
<svg class="icon icon-rotate text-primary">...</svg>
```

### Filled vs outline

By default Tabler icons are **outline** (`fill="none"`). For filled, use the filled variant from tabler.io/icons. Some have separate "filled" pages.

### Icon in button

```html
<a class="btn btn-primary">
  <svg class="icon">...</svg> Save
</a>

<!-- Icon-only -->
<a class="btn btn-icon btn-primary">
  <svg class="icon">...</svg>
</a>

<!-- Trailing icon -->
<a class="btn btn-primary">
  Next <svg class="icon ms-2">...</svg>
</a>
```

### Common icons used in this project

These are sprinkled throughout the navbar, settings panel, dashboards:

- **Settings gear** (`settings`):
  ```html
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
  ```
- **User** (`user`): `<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>`
- **Home** (`home`): `<path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/>`
- **Search** (`search`): `<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/>`
- **Plus** (`plus`): `<path d="M12 5v14m-7 -7h14"/>`
- **Edit** (`edit`): `<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"/><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97L9 12v3h3l8.385 -8.415z"/><path d="M16 5l3 3"/>`
- **Trash** (`trash`): `<path d="M4 7l16 0"/><path d="M10 11l0 6"/><path d="M14 11l0 6"/><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"/><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"/>`
- **Check** (`check`): `<path d="M5 12l5 5l10 -10"/>`
- **X** (`x`): `<path d="M18 6l-12 12"/><path d="M6 6l12 12"/>`
- **Chevron right** (`chevron-right`): `<path d="M9 6l6 6l-6 6"/>`

For everything else: copy from tabler.io/icons.

## Typography

### Headings
```html
<h1>Heading 1 — 2rem</h1>
<h2>Heading 2 — 1.5rem</h2>
<h3>Heading 3 — 1.25rem</h3>
<h4>Heading 4 — 1.125rem</h4>
<h5>Heading 5 — 1rem</h5>
<h6>Heading 6 — 0.875rem</h6>
```

Also as utility classes: `.h1` through `.h6` apply heading size without using the heading tag.

### Display headings (large, marketing)
```html
<h1 class="display-1">Display 1</h1>   <!-- 5rem -->
<h1 class="display-2">Display 2</h1>   <!-- 4.5rem -->
<h1 class="display-3">Display 3</h1>   <!-- 4rem -->
<h1 class="display-4">Display 4</h1>   <!-- 3.5rem -->
<h1 class="display-5">Display 5</h1>   <!-- 3rem -->
<h1 class="display-6">Display 6</h1>   <!-- 2.5rem -->
```

Use display sizes for hero sections — see [page-landing.md](page-landing.md).

### Page-header titles
```html
<div class="page-header">
  <div class="page-pretitle">Overview</div>
  <h2 class="page-title">My Dashboard</h2>
</div>
```

`.page-pretitle` is small-uppercase muted text above the title.

### Lead paragraph
```html
<p class="lead">Larger paragraph for intros, summaries.</p>
```

### Text utility classes
- **Weight**: `fw-light` `fw-normal` `fw-medium` `fw-semibold` `fw-bold` `fw-bolder`
- **Style**: `fst-italic` `fst-normal`
- **Decoration**: `text-decoration-underline` `text-decoration-line-through` `text-decoration-none`
- **Transform**: `text-uppercase` `text-lowercase` `text-capitalize`
- **Alignment**: `text-start` `text-center` `text-end` (responsive: `text-md-end`)
- **Wrapping**: `text-wrap` `text-nowrap` `text-truncate` `text-break`
- **Size**: `fs-1` (largest) through `fs-6` (smallest); also `fs-h1` etc.

### Text colors
- **Semantic**: `text-primary` `text-secondary` `text-success` `text-warning` `text-danger` `text-info` `text-muted` `text-body` `text-white` `text-dark`
- **Subheader** (small uppercase muted): `<span class="subheader">Label</span>`
- **Named palette**: `text-blue` `text-azure` ... `text-cyan`
- **Light variants** (low-contrast for backgrounds): not as text — use for elements

### Links
```html
<a href="#" class="link-primary">Primary</a>
<a href="#" class="link-secondary">Secondary</a>
<a href="#" class="link-muted">Muted</a>
```

`.link-secondary` is what the footer uses — see `tabler/base.html` lines 86-101.

### Font family override (per element)
```html
<p style="font-family: var(--tblr-font-monospace)">Mono text</p>
```

But prefer the `data-bs-theme-font` setting at the doc level — see [theming.md](theming.md).

## Code blocks

### Inline code
```html
<p>Run <code>uv sync</code> to install.</p>
```

Tabler styles `<code>` with the accent color (`--tblr-code-color`).

### Block code
```html
<pre><code class="language-python">def hello():
    return "world"
</code></pre>
```

Without syntax highlighting, you get monospace + indentation. For highlighting, add **Prism.js**:

```django
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
<style>
body.theme-dark pre[class*="language-"] { background: var(--tblr-gray-900) !important; }
</style>
{% endblock %}

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
{% endblock %}
```

The autoloader fetches just the language definitions you actually use. Supported languages: Python, JavaScript, TypeScript, JSON, YAML, Bash, SQL, HTML, CSS, and 200+ more.

### Copy-to-clipboard for code blocks

Tabler ships with Clipboard.js. Add a copy button:

```html
<div class="position-relative">
  <button class="btn btn-sm btn-icon position-absolute top-0 end-0 m-2"
          data-clipboard-target="#code-1" title="Copy">
    <svg class="icon">...</svg>
  </button>
  <pre><code id="code-1" class="language-bash">uv sync</code></pre>
</div>

<script>
new ClipboardJS('[data-clipboard-target]');
</script>
```

ClipboardJS is global (`window.ClipboardJS`) when Tabler's JS loads.

## Markdown rendering

### Server-side (Python)

For help/blog/docs pages rendered server-side, use SmallStack's existing markdown pipeline. The `apps/help/` app reads markdown from `content/` and renders to HTML. See `apps/help/services.py` for the renderer setup.

To render markdown in your own view:

```python
import markdown

def my_view(request):
    md_text = "# Hello\n\nWith **bold**."
    html = markdown.markdown(md_text, extensions=['fenced_code', 'tables', 'toc'])
    return render(request, "myapp/page.html", {"content_html": html})
```

```django
<div class="markdown">{{ content_html|safe }}</div>
```

The `.markdown` class scopes Tabler's prose styling — headings, paragraphs, lists, blockquotes, code blocks, tables all get appropriate spacing and color.

### Client-side (browser)

For previews (e.g., editing a markdown comment), use [Marked.js](https://marked.js.org/):

```html
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<textarea id="md-input"></textarea>
<div id="md-preview" class="markdown"></div>

<script>
document.getElementById('md-input').addEventListener('input', function() {
  document.getElementById('md-preview').innerHTML = marked.parse(this.value);
});
</script>
```

## Tabler's prose class

Wrap article content in `.markdown` (a class Tabler defines) to get prose styles:

```html
<div class="markdown">
  <h1>Article Title</h1>
  <p>Lead paragraph.</p>
  <h2>Section</h2>
  <p>Body. With <strong>bold</strong> and <em>italic</em> and <code>inline code</code>.</p>
  <ul>
    <li>List items</li>
  </ul>
  <blockquote>Quoted text.</blockquote>
  <pre><code>code block</code></pre>
</div>
```

Used in [page-content.md](page-content.md) blog/docs layouts.

## Subheader (small label)

A small uppercase, muted label common above stat numbers and section dividers:

```html
<div class="subheader">Total revenue</div>
<div class="h1">$4,300</div>
```

Or use `.text-uppercase .text-secondary .small fw-bold .lh-1` manually.

## Print typography

```css
@media print {
  body { font-family: Georgia, serif; }
  h1, h2, h3 { page-break-after: avoid; }
  pre, blockquote { page-break-inside: avoid; }
}
```

Add to `extra_css` for print-heavy pages (invoices, reports).

## Gotchas

- **Always set `stroke="currentColor"`** in the SVG — color via text utilities. Otherwise icons become hard to theme.
- **The `class="icon"` is required** for proper sizing — without it, the SVG uses `width`/`height` attributes verbatim and won't respect size classes.
- **Pasting from tabler.io leaves a `class="icon icon-tabler ..."` long class** — you can keep it or trim to just `class="icon"`; both work.
- **Inline SVG bloats template size** — for pages with many icons, consider using `<use>` from a sprite sheet. Not currently set up in this repo; for the rare case it matters (long lists), repeat as needed.
- **Prism.js is not loaded by default** — only on pages that need code highlighting. Don't bake it into base.html.
- **`code` tag accent color** is set by `--tblr-code-color` in `tabler_overrides.css` (defaults to amber). It does **not** auto-track the accent color setting — to make it track, add `--tblr-code-color` to the dynamic style in `applyColor()`. [theming.md](theming.md) has details.
- **`.markdown` class is for *output* HTML, not input markdown** — wrap the rendered HTML, not the raw text.

## Related skills

- [theming.md](theming.md) — for changing the default font + code color
- [components.md](components.md) — for components that use icons
- [page-content.md](page-content.md) — for markdown/article layouts
- [page-api-explorer.md](page-api-explorer.md) — for code-heavy API docs pages
- [forms.md](forms.md) — for icons inside form inputs (input-icon, input-group)
