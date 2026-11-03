# Page recipe — blog, docs, articles, content pages

**Use this skill when** building blog posts, documentation pages, knowledge-base articles, help pages, release notes, or any long-form text content with structure.

## Tabler references

- Preview: https://preview.tabler.io/blog-post.html
- Preview: https://preview.tabler.io/blog.html — blog listing
- Preview: https://preview.tabler.io/docs.html — documentation layout

## In-repo examples

- `apps/tabler/templates/help/help_index.html` — help home with sections
- `apps/tabler/templates/help/help_section_index.html` — section listing
- `apps/tabler/templates/help/help_detail.html` — detailed help article with sidebar
- `apps/tabler/templates/help/slides.html` — slide-deck presentation view
- `apps/tabler/static/tabler/css/slides.css` — slide viewer styles
- `apps/help/` Django app — markdown rendering, section/category config
- `apps/help/services.py` — markdown rendering pipeline

## Article / blog post layout

```django
{% extends "tabler/base.html" %}
{% load static theme_tags %}

{% block title %}{{ post.title }}{% endblock %}

{% block breadcrumbs %}
  {% breadcrumb "Home" "website:home" %}
  {% breadcrumb "Blog" "blog:index" %}
  {% breadcrumb post.title %}
  {% render_tabler_breadcrumbs %}
{% endblock %}

{% block content %}
<article class="row justify-content-center">
  <div class="col-md-10 col-lg-8">
    <header class="mb-4">
      <div class="subheader text-primary">{{ post.category.name }}</div>
      <h1 class="display-5 fw-bold mt-2">{{ post.title }}</h1>
      <div class="d-flex align-items-center text-secondary mt-3 small">
        <span class="avatar avatar-xs me-2 bg-primary-lt">{{ post.author.username|slice:":2"|upper }}</span>
        <span>{{ post.author.get_full_name|default:post.author.username }}</span>
        <span class="mx-2">·</span>
        <span>{% localtime_tooltip post.published_at "M d, Y" %}</span>
        <span class="mx-2">·</span>
        <span>{{ post.reading_time_minutes }} min read</span>
      </div>
    </header>

    {% if post.cover_image %}
    <img src="{% static post.cover_image %}" alt=""
         class="img-fluid rounded mb-4" style="aspect-ratio: 16/9; object-fit: cover;">
    {% endif %}

    <div class="markdown">
      {{ post.body_html|safe }}
    </div>

    {% include 'blog/_share.html' %}
    {% include 'blog/_related.html' %}
  </div>
</article>
{% endblock %}
```

## Markdown rendering (server-side)

For SmallStack help pages, use the existing pipeline in `apps/help/services.py`. For your own blog:

```python
# apps/blog/services.py
import markdown
from markdown.extensions.toc import TocExtension

def render_markdown(text):
    md = markdown.Markdown(extensions=[
        'fenced_code',
        'tables',
        TocExtension(baselevel=2, anchorlink=True),
        'codehilite',     # for syntax highlighting via Pygments
        'attr_list',
        'admonition',
    ])
    html = md.convert(text)
    toc_html = md.toc
    return html, toc_html
```

In your model:

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=200)
    body_md = models.TextField()
    body_html = models.TextField(editable=False)
    toc_html = models.TextField(editable=False, blank=True)

    def save(self, *args, **kwargs):
        from .services import render_markdown
        self.body_html, self.toc_html = render_markdown(self.body_md)
        super().save(*args, **kwargs)
```

Render in template:

```django
<div class="markdown">{{ post.body_html|safe }}</div>
```

`.markdown` class styles paragraphs, headings, lists, blockquotes, code, tables per Tabler conventions. See [icons-typography.md](icons-typography.md) for details.

## Code blocks (with syntax highlighting)

### Server-side: Pygments via codehilite

```python
md = markdown.Markdown(extensions=['fenced_code', 'codehilite'])
```

Add Pygments CSS:

```django
{% block extra_css %}
<link rel="stylesheet" href="{% static 'css/pygments-tabler.css' %}">
{% endblock %}
```

Generate `pygments-tabler.css` with:
```bash
uv run pygmentize -S monokai -f html -a .codehilite > static/css/pygments-tabler.css
```

### Client-side: Prism.js (recommended for docs)

```django
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
<style>
body.theme-dark pre[class*="language-"] { background: var(--tblr-gray-900) !important; }
body:not(.theme-dark) pre[class*="language-"] { background: var(--tblr-gray-100) !important; }
</style>
{% endblock %}

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
{% endblock %}
```

Prism auto-loads only the languages used on the page. See [icons-typography.md](icons-typography.md).

### Copy-to-clipboard button

```html
<div class="position-relative">
  <button class="btn btn-sm btn-icon position-absolute top-0 end-0 m-2"
          data-clipboard-target="#code-1" title="Copy">
    <svg class="icon">...</svg>
  </button>
  <pre><code id="code-1" class="language-python">
def hello():
    return "world"
  </code></pre>
</div>
```

Tabler bundles ClipboardJS — `new ClipboardJS('[data-clipboard-target]')` enables all buttons.

## Table of contents (sidebar)

```html
<div class="row">
  <aside class="col-lg-3 d-none d-lg-block">
    <div class="card position-sticky" style="top: 80px;">
      <div class="card-body">
        <div class="subheader mb-2">On this page</div>
        <nav class="article-toc">
          {{ post.toc_html|safe }}
        </nav>
      </div>
    </div>
  </aside>

  <article class="col-lg-9">
    <h1>{{ post.title }}</h1>
    <div class="markdown">{{ post.body_html|safe }}</div>
  </article>
</div>

<style>
.article-toc ul { list-style: none; padding-left: 0; }
.article-toc li { padding: 0.25rem 0; }
.article-toc a { color: var(--tblr-muted); text-decoration: none; font-size: 0.875rem; }
.article-toc a:hover { color: var(--tblr-primary); }
.article-toc li.active > a { color: var(--tblr-primary); font-weight: 600; }
</style>
```

### Active section highlight (scroll spy)

```html
<script>
const headings = document.querySelectorAll('.markdown h2[id], .markdown h3[id]');
const tocLinks = document.querySelectorAll('.article-toc a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      tocLinks.forEach(link => {
        const li = link.closest('li');
        li?.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-80px 0px -70% 0px' });

headings.forEach(h => observer.observe(h));
</script>
```

## Blog index / listing

### Card grid

```html
{% block content %}
<div class="row row-cards g-4">
  {% for post in posts %}
  <div class="col-md-6 col-lg-4">
    <a href="{% url 'blog:detail' post.slug %}" class="card card-link h-100">
      {% if post.cover_image %}
      <img src="{% static post.cover_image %}" class="card-img-top" style="aspect-ratio: 16/9; object-fit: cover;">
      {% endif %}
      <div class="card-body">
        <div class="subheader text-primary">{{ post.category.name }}</div>
        <h3 class="card-title mt-2">{{ post.title }}</h3>
        <p class="text-secondary">{{ post.excerpt }}</p>
      </div>
      <div class="card-footer d-flex align-items-center">
        <span class="avatar avatar-xs me-2 bg-primary-lt">{{ post.author.username|slice:":2"|upper }}</span>
        <small class="text-secondary">{{ post.published_at|date:"M d, Y" }}</small>
        <small class="ms-auto text-secondary">{{ post.reading_time_minutes }} min</small>
      </div>
    </a>
  </div>
  {% endfor %}
</div>

{% include 'blog/_pagination.html' %}
{% endblock %}
```

### Compact list (for docs/sidebar nav)

```html
<div class="list-group">
  {% for doc in docs %}
  <a href="{{ doc.get_absolute_url }}"
     class="list-group-item list-group-item-action {% if doc == current_doc %}active{% endif %}">
    <div class="d-flex">
      <span>{{ doc.title }}</span>
      <small class="ms-auto text-secondary">{{ doc.section.name }}</small>
    </div>
  </a>
  {% endfor %}
</div>
```

## Docs layout (three-column: sidebar nav, content, TOC)

```html
{% block content %}
<div class="row">
  <!-- Left: section nav -->
  <aside class="col-lg-3">
    <div class="position-sticky" style="top: 80px;">
      {% for section in sections %}
      <div class="mb-3">
        <div class="subheader mb-2">{{ section.name }}</div>
        <div class="list-group list-group-flush">
          {% for doc in section.docs %}
          <a href="{{ doc.get_absolute_url }}"
             class="list-group-item list-group-item-action {% if doc == current_doc %}active{% endif %}">
            {{ doc.title }}
          </a>
          {% endfor %}
        </div>
      </div>
      {% endfor %}
    </div>
  </aside>

  <!-- Middle: content -->
  <article class="col-lg-6">
    <header class="mb-4">
      <div class="subheader">{{ current_doc.section.name }}</div>
      <h1 class="page-title mt-2">{{ current_doc.title }}</h1>
    </header>

    <div class="markdown">{{ current_doc.body_html|safe }}</div>

    <div class="d-flex justify-content-between mt-5 pt-3 border-top">
      {% if prev_doc %}<a href="{{ prev_doc.get_absolute_url }}">← {{ prev_doc.title }}</a>{% endif %}
      {% if next_doc %}<a href="{{ next_doc.get_absolute_url }}" class="ms-auto">{{ next_doc.title }} →</a>{% endif %}
    </div>
  </article>

  <!-- Right: on-this-page -->
  <aside class="col-lg-3 d-none d-lg-block">
    <div class="position-sticky" style="top: 80px;">
      <div class="subheader mb-2">On this page</div>
      <nav class="article-toc">{{ current_doc.toc_html|safe }}</nav>
    </div>
  </aside>
</div>
{% endblock %}
```

Help docs in this repo follow this pattern — see `apps/tabler/templates/help/help_detail.html`.

## Search across content

### Client-side (List.js — fast for <2000 docs)

```html
<div id="docs-search">
  <div class="input-icon mb-3">
    <span class="input-icon-addon"><svg class="icon">...</svg></span>
    <input class="form-control search" placeholder="Search docs...">
  </div>
  <ul class="list list-unstyled">
    {% for doc in all_docs %}
    <li>
      <a href="{{ doc.get_absolute_url }}" class="d-block py-2 border-bottom">
        <strong class="name">{{ doc.title }}</strong>
        <p class="text-secondary small body mb-0">{{ doc.excerpt }}</p>
      </a>
    </li>
    {% endfor %}
  </ul>
</div>

<script src="https://cdn.jsdelivr.net/npm/list.js@2.3.1/dist/list.min.js"></script>
<script>
new List('docs-search', { valueNames: ['name', 'body'] });
</script>
```

### Server-side (htmx + Postgres full-text)

```html
<input type="search" class="form-control"
       hx-get="{% url 'docs:search' %}"
       hx-trigger="keyup changed delay:300ms"
       hx-target="#search-results"
       placeholder="Search docs...">

<div id="search-results"></div>
```

Server returns ranked partial.

## Slide / presentation viewer

The help system ships with a slide viewer — see `apps/tabler/templates/help/slides.html` and `apps/tabler/static/tabler/css/slides.css`.

Pattern:

```html
<div class="slides-viewport">
  {% for slide in doc.slides %}
  <div class="slide" data-slide="{{ forloop.counter }}">
    <div class="slide-content">
      {{ slide.body_html|safe }}
    </div>
  </div>
  {% endfor %}
</div>

<div class="slides-progress">
  <div class="slides-progress-bar" id="slides-progress-bar"></div>
</div>

<script>
let current = 1;
const total = document.querySelectorAll('.slide').length;
function show(n) {
  document.querySelectorAll('.slide').forEach(s => s.classList.toggle('active', +s.dataset.slide === n));
  document.getElementById('slides-progress-bar').style.width = (n / total * 100) + '%';
}
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') { current = Math.min(total, current + 1); show(current); }
  if (e.key === 'ArrowLeft') { current = Math.max(1, current - 1); show(current); }
});
show(1);
</script>
```

The CSS in `slides.css` handles transitions, sticky progress bar, header, and counter display.

## Reading progress bar (top of article)

```html
<div id="read-progress" class="position-fixed top-0 start-0 end-0"
     style="height: 3px; background: var(--tblr-primary); width: 0; transition: width 100ms; z-index: 1080;"></div>

<script>
window.addEventListener('scroll', () => {
  const article = document.querySelector('article');
  const rect = article.getBoundingClientRect();
  const total = rect.height - window.innerHeight;
  const seen = -rect.top;
  const pct = Math.max(0, Math.min(100, (seen / total) * 100));
  document.getElementById('read-progress').style.width = pct + '%';
});
</script>
```

## Related posts

```html
<section class="mt-6 pt-4 border-top">
  <h3>Continue reading</h3>
  <div class="row row-cards g-3 mt-2">
    {% for r in related %}
    <div class="col-md-4">
      <a href="{{ r.get_absolute_url }}" class="card card-link h-100">
        <div class="card-body">
          <div class="subheader text-primary">{{ r.category.name }}</div>
          <h4 class="card-title mt-2">{{ r.title }}</h4>
          <p class="text-secondary mb-0">{{ r.excerpt|truncatewords:20 }}</p>
        </div>
      </a>
    </div>
    {% endfor %}
  </div>
</section>
```

## Social share buttons

```html
<div class="d-flex gap-2 mt-4 pt-4 border-top">
  <span class="text-secondary me-2">Share:</span>
  <a class="btn btn-sm btn-outline-secondary"
     href="https://twitter.com/intent/tweet?text={{ post.title|urlencode }}&url={{ post.get_absolute_url|build_absolute_uri }}"
     target="_blank">
    Twitter
  </a>
  <a class="btn btn-sm btn-outline-secondary"
     href="https://www.linkedin.com/sharing/share-offsite/?url={{ post.get_absolute_url|build_absolute_uri }}"
     target="_blank">
    LinkedIn
  </a>
  <button class="btn btn-sm btn-outline-secondary"
          data-clipboard-text="{{ post.get_absolute_url|build_absolute_uri }}">
    Copy link
  </button>
</div>
```

## Comments

For simple comments, use htmx-driven inline forms — see [htmx-patterns.md](htmx-patterns.md) for the form-submission pattern. For richer threading, consider [django-machina](https://django-machina.readthedocs.io/) or roll your own.

## Open Graph / SEO meta

In your content template:

```django
{% block extra_css %}
<meta name="description" content="{{ post.excerpt }}">
<meta property="og:title" content="{{ post.title }}">
<meta property="og:description" content="{{ post.excerpt }}">
<meta property="og:image" content="{{ post.cover_image_url }}">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
{% endblock %}
```

The default `brand.social_image` from context processors covers fallback.

## Gotchas

- **Don't put markdown into `{% block content %}` directly without `.markdown` wrap** — paragraph spacing, code styling, blockquote bars all live on that class.
- **Heading IDs require the TOC extension** — without it, you can't deep-link to sections.
- **Markdown rendered at save time goes stale** if you change the renderer config — add a management command to re-render all posts.
- **Prism.js auto-loads languages from `class="language-foo"`** — the markdown renderer must add that class to `<code>` tags. `fenced_code` extension does it; raw `<code>` blocks don't.
- **Sticky sidebars need `top:` to account for the navbar** — use `top: 80px` (navbar height) or the sidebar sticks under the nav.
- **Scroll-spy IntersectionObserver fires per heading visible** — without `rootMargin`, the first heading can show as active while you're already scrolled past it. Use `rootMargin: '-80px 0px -70% 0px'` to bias toward the heading that's near the top of viewport.
- **`{{ post.body_html|safe }}` exposes you to XSS if `body_md` is user input** — use `bleach` to sanitize after markdown rendering, or never let untrusted users edit posts.
- **Slide viewer key handlers conflict with form inputs** — wrap the listener with `if (e.target.matches('input,textarea')) return;`.

## Related skills

- [icons-typography.md](icons-typography.md) — for code blocks, prose styling, markdown class
- [components.md](components.md) — for cards, list-groups, accordions used in content layouts
- [forms.md](forms.md) — for comment forms, search inputs
- [htmx-patterns.md](htmx-patterns.md) — for live search, comments
- [../help-documentation.md](../help-documentation.md) — for the SmallStack help system specifically
