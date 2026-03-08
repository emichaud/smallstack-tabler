# SmallStack-Tabler Setup Notes

## What Was Built

This project adds the **Tabler dark admin theme** to a SmallStack Django project,
replicating the look of the [Tabler dark admin preview](https://tabler.io/admin-template/preview).

### Components Created

1. **Tabler Theme Base Template** (`templates/tabler/base.html`)
   - Standalone base template using Tabler CSS/JS via CDN
   - Does NOT extend SmallStack's `smallstack/base.html` — completely independent
   - Includes Inter font, dark body class, footer

2. **Tabler Navbar** (`templates/tabler/includes/navbar.html`)
   - Dark horizontal top nav with logo, nav links, user dropdown
   - Responsive with mobile hamburger toggle

3. **CSS Overrides** (`static/tabler/css/tabler_overrides.css`)
   - Forces dark color palette matching the Tabler preview
   - Custom stat card, welcome card, sparkline, and donut chart styles
   - Color utility classes (`.text-amber`, `.text-green`, etc.)

4. **Dashboard Home Page** (`templates/website/home.html`)
   - Real Django template extending `tabler/base.html`
   - Welcome hero card with mini-stats
   - Stat cards with sparkline charts (Chart.js)
   - Donut/gauge chart for active users
   - Dynamic username from `request.user`

5. **Preview App** (`apps/preview/`)
   - 8 preview pages: Dashboard, Cards, Forms, Tables, Charts, Buttons, Colors, Typography
   - Pure Tabler HTML reference pages — no backend logic
   - Own base template (`preview/base_preview.html`) with nav between pages
   - Charts page includes Chart.js line, bar, doughnut, polar area, and radar charts

6. **Tabler Source Reference** (`_tabler_source/`)
   - Shallow clone of the Tabler repo for design reference
   - NOT committed — add to `.gitignore`

---

## How the Theme System Works

SmallStack doesn't have a formal "theme registry." Themes are just alternative
base templates:

```
templates/
├── smallstack/base.html    ← Default SmallStack theme (sidebar + topbar)
├── tabler/base.html        ← Tabler dark admin theme (topbar only)
└── website/home.html       ← Extends tabler/base.html
```

To use the Tabler theme for a page, extend `tabler/base.html`:

```html
{% extends "tabler/base.html" %}
{% block title %}My Page{% endblock %}
{% block content %}
    ...
{% endblock %}
```

To use the default SmallStack theme, extend `smallstack/base.html` as usual.
Both can coexist — different pages can use different themes.

### Available Blocks in `tabler/base.html`

| Block | Purpose |
|-------|---------|
| `title` | Page title (in `<title>` tag) |
| `extra_css` | Additional CSS links |
| `body_class` | Extra classes on `<body>` |
| `navbar` | Full navbar override |
| `nav_home_active` | Set to `active` for Home nav highlight |
| `page_header` | Page header area (pretitle + title + buttons) |
| `content` | Main page content |
| `extra_js` | Additional scripts |

---

## How to Add More Real Pages

### Step 1: Create the Template

```html
{# templates/website/reports.html #}
{% extends "tabler/base.html" %}
{% block title %}Reports{% endblock %}

{% block page_header %}
<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="page-pretitle">Analytics</div>
        <h2 class="page-title">Reports</h2>
    </div>
</div>
{% endblock %}

{% block content %}
<div class="row row-deck row-cards">
    <div class="col-12">
        <div class="card">
            <div class="card-body">Your content here</div>
        </div>
    </div>
</div>
{% endblock %}
```

### Step 2: Add URL and View

```python
# apps/website/urls.py
path("reports/", views.reports_view, name="reports"),

# apps/website/views.py
def reports_view(request):
    return render(request, "website/reports.html", {"data": ...})
```

### Step 3: Add Nav Link (optional)

Edit `templates/tabler/includes/navbar.html` to add your page to the nav.

---

## Graduating a Preview Page to a Real Page

1. Open the preview page (e.g., `/preview/tables/`) for visual reference
2. Create a new template extending `tabler/base.html`
3. Copy the HTML structure from the preview template
4. Replace static data with Django template variables
5. Add a view that queries real data and passes it to the template
6. Add URL route in `apps/website/urls.py`

---

## CDN Versions Used

| Library | Version | CDN |
|---------|---------|-----|
| Tabler CSS | 1.2.0 | `cdn.jsdelivr.net/npm/@tabler/core@1.2.0/dist/css/tabler.min.css` |
| Tabler JS | 1.2.0 | `cdn.jsdelivr.net/npm/@tabler/core@1.2.0/dist/js/tabler.min.js` |
| Chart.js | 4.4.7 | `cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js` |
| Inter Font | Latest | `fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700` |

---

## Architectural Decisions

### Why a separate base template instead of modifying SmallStack's?
The default SmallStack theme (Django admin CSS + sidebar) is intentionally
preserved. The Tabler theme is a parallel option, not a replacement. This means:
- Existing SmallStack pages (help, profile, admin) still work normally
- You can mix themes per-page if needed
- Upstream SmallStack updates won't conflict with theme changes

### Why CDN instead of vendored assets?
CDN is simpler for initial development and reduces repo size. For production,
consider vendoring Tabler CSS/JS into `static/tabler/vendor/` for reliability.

### Why Chart.js over D3?
Chart.js is much simpler for sparklines and basic charts. It's ~60KB vs D3's
~250KB, has a declarative config API, and Tabler's own premium version uses it.

### Preview app as separate Django app
Keeps reference pages isolated from real app logic. Easy to remove entirely
by deleting the app and removing from `INSTALLED_APPS` + `urls.py`.

---

## Setup Steps Taken

```bash
# 1. Clone SmallStack
git clone https://github.com/emichaud/django-smallstack smallstack-tabler
cd smallstack-tabler

# 2. Install dependencies + migrate + create superuser
make setup

# 3. Clone Tabler source for reference
git clone --depth 1 https://github.com/tabler/tabler _tabler_source

# 4. Created theme files:
#    - templates/tabler/base.html
#    - templates/tabler/includes/navbar.html
#    - static/tabler/css/tabler_overrides.css

# 5. Updated home page to use Tabler theme:
#    - templates/website/home.html (extends tabler/base.html)

# 6. Created preview app:
#    - apps/preview/ (views, urls, templates)
#    - 8 preview pages with Tabler components

# 7. Registered preview app:
#    - Added to INSTALLED_APPS in config/settings/base.py
#    - Added URL route in config/urls.py

# 8. Run server
make run  # or: PORT=8007 make run
```
