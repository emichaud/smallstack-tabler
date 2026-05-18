# Skill: Building Pages with the Tabler UI Framework

This skill teaches how to build polished, consistent admin pages using the Tabler UI framework within the SmallStack-Tabler project. Use this when creating new pages, components, or layouts.

## Overview

SmallStack-Tabler uses [Tabler](https://tabler.io) v1.0.0-beta20, an open-source admin dashboard built on **Bootstrap 5**. All Bootstrap 5 utilities work. Tabler adds admin-specific components: cards with status indicators, stat widgets, ribbons, steps, data grids, and 5000+ stroke icons.

**CDN assets loaded in `tabler/base.html`:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta20/dist/css/tabler.min.css">
<script src="https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta20/dist/js/tabler.min.js"></script>
```

**Local overrides:**
- `apps/tabler/static/tabler/css/tabler_overrides.css` — dark mode, accent colors, component polish
- `apps/tabler/static/tabler/js/tabler_theme.js` — settings panel, theme/color/layout persistence

## Template Skeleton

Every page extends `tabler/base.html` and uses these blocks:

```html
{% extends "tabler/base.html" %}
{% load static theme_tags %}

{% block title %}Page Title{% endblock %}

{% block extra_css %}
<style>
/* Page-specific styles (keep minimal) */
</style>
{% endblock %}

{% block page_header %}
<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="row g-2 align-items-center">
            <div class="col">
                <div class="page-pretitle">Section</div>
                <h2 class="page-title">Page Title</h2>
            </div>
            <div class="col-auto ms-auto d-print-none">
                <div class="btn-list">
                    <a href="#" class="btn btn-primary">
                        <svg>...</svg> Action
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}

{% block content %}
<div class="row row-deck row-cards">
    <!-- Page content -->
</div>
{% endblock %}

{% block extra_js %}
<script>
// Page-specific JS
</script>
{% endblock %}
```

## Dark Mode & Theming

Theme switching is handled automatically. The system uses:
- `data-bs-theme="dark|light"` on `<html>`
- `body.theme-dark` class on `<body>`
- `localStorage` keys: `smallstack-theme`, `smallstack-color`, `smallstack-font`, `smallstack-base`, `smallstack-radius`, `smallstack-layout`

### Primary Color (Accent)

The accent color is set via `--tblr-primary`. Available schemes:

| Name | Hex | Use |
|------|-----|-----|
| amber | `#f59f00` | Default — warm gold |
| blue | `#206bc4` | Classic corporate |
| azure | `#4299e1` | Light blue |
| indigo | `#4263eb` | Deep blue-purple |
| purple | `#ae3ec9` | Vibrant purple |
| pink | `#d6336c` | Hot pink |
| red | `#d63939` | Alert/danger accent |
| orange | `#f76707` | Energetic orange |
| green | `#2fb344` | Success/growth |
| teal | `#0ca678` | Cool green |
| cyan | `#17a2b8` | Info blue |

To change the default accent, edit `tabler_overrides.css`:
```css
:root {
    --tblr-primary: #f59f00;
    --tblr-primary-rgb: 245, 159, 0;
}
```

### Font Options

Set via `data-bs-theme-font` attribute on `<html>`:
- `sans-serif` (default — Inter)
- `serif`
- `monospace`

### Layout Options

Applied via body classes or `data-bs-theme-base`:
- `layout-boxed` — max-width centered container
- `layout-condensed` — tighter spacing
- `layout-fluid` — full-width, no max container
- `navbar-sticky` — fixed navbar on scroll

## Page Layouts

### Standard Layout (Horizontal Navbar)
```html
<div class="page">
    <header class="navbar navbar-expand-md d-print-none">...</header>
    <div class="page-wrapper">
        <div class="page-header">...</div>
        <div class="page-body">
            <div class="container-xl">
                <!-- Content -->
            </div>
        </div>
        <footer class="footer">...</footer>
    </div>
</div>
```

### Key Layout Classes

| Class | Purpose |
|-------|---------|
| `.page` | Root wrapper |
| `.page-wrapper` | Content area below navbar |
| `.page-body` | Main content section |
| `.page-header` | Page title area |
| `.container-xl` | Max-width content container |
| `.d-print-none` | Hide from print |

## Components Reference

### Cards

Cards are the primary content container. Always use cards to group related content.

```html
<!-- Basic card -->
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Title</h3>
    </div>
    <div class="card-body">Content</div>
    <div class="card-footer">Footer</div>
</div>

<!-- Card with status indicator -->
<div class="card">
    <div class="card-status-top bg-primary"></div>
    <div class="card-body">Important content</div>
</div>

<!-- Card with side status -->
<div class="card">
    <div class="card-status-start bg-green"></div>
    <div class="card-body">Success item</div>
</div>

<!-- Stacked card (space-saving) -->
<div class="card card-stacked">
    <div class="card-body">Stacked look</div>
</div>

<!-- Card with tabs -->
<div class="card">
    <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#tab1">Tab 1</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#tab2">Tab 2</a>
            </li>
        </ul>
    </div>
    <div class="card-body">
        <div class="tab-content">
            <div class="tab-pane active" id="tab1">Content 1</div>
            <div class="tab-pane" id="tab2">Content 2</div>
        </div>
    </div>
</div>
```

**Card sizing:** `.card-sm` (compact), `.card-md` (default), `.card-lg` (spacious)

**Card grid layout:**
```html
<div class="row row-deck row-cards">
    <div class="col-sm-6 col-lg-3">
        <div class="card">...</div>
    </div>
    <div class="col-sm-6 col-lg-3">
        <div class="card">...</div>
    </div>
</div>
```

`row-deck` makes all cards in a row equal height. `row-cards` adds card-appropriate gutters.

### Stat Cards (Dashboard Widgets)

```html
<div class="col-sm-6 col-lg-3">
    <div class="card card-sm">
        <div class="card-body">
            <div class="row align-items-center">
                <div class="col-auto">
                    <span class="bg-primary text-white avatar">
                        <svg><!-- icon --></svg>
                    </span>
                </div>
                <div class="col">
                    <div class="font-weight-medium">1,352 users</div>
                    <div class="text-secondary">12 new today</div>
                </div>
            </div>
        </div>
    </div>
</div>
```

**Stat with trend:**
```html
<div class="card card-sm">
    <div class="card-body">
        <div class="d-flex align-items-center">
            <div class="subheader">Revenue</div>
            <div class="ms-auto lh-1">
                <span class="text-green d-inline-flex align-items-center lh-1">
                    8% <svg><!-- trending up icon --></svg>
                </span>
            </div>
        </div>
        <div class="h1 mb-0">$4,300</div>
    </div>
</div>
```

### Buttons

```html
<!-- Color variants -->
<a class="btn btn-primary">Primary</a>
<a class="btn btn-secondary">Secondary</a>
<a class="btn btn-success">Success</a>
<a class="btn btn-warning">Warning</a>
<a class="btn btn-danger">Danger</a>
<a class="btn btn-info">Info</a>

<!-- Extended palette -->
<a class="btn btn-blue">Blue</a>
<a class="btn btn-azure">Azure</a>
<a class="btn btn-indigo">Indigo</a>
<a class="btn btn-purple">Purple</a>
<a class="btn btn-pink">Pink</a>
<a class="btn btn-red">Red</a>
<a class="btn btn-orange">Orange</a>
<a class="btn btn-yellow">Yellow</a>
<a class="btn btn-lime">Lime</a>
<a class="btn btn-green">Green</a>
<a class="btn btn-teal">Teal</a>
<a class="btn btn-cyan">Cyan</a>

<!-- Styles -->
<a class="btn btn-outline-primary">Outline</a>
<a class="btn btn-ghost-primary">Ghost</a>

<!-- Sizes -->
<a class="btn btn-primary btn-xs">XS</a>
<a class="btn btn-primary btn-sm">SM</a>
<a class="btn btn-primary">Default</a>
<a class="btn btn-primary btn-lg">LG</a>
<a class="btn btn-primary btn-xl">XL</a>

<!-- Shapes -->
<a class="btn btn-primary btn-pill">Pill</a>
<a class="btn btn-primary btn-square">Square</a>

<!-- Icon button -->
<a class="btn btn-primary btn-icon">
    <svg><!-- icon --></svg>
</a>

<!-- Loading state -->
<a class="btn btn-primary btn-loading">Loading</a>

<!-- Button list (proper spacing) -->
<div class="btn-list">
    <a class="btn btn-primary">Save</a>
    <a class="btn btn-outline-secondary">Cancel</a>
</div>
```

### Tables

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Users</h3>
    </div>
    <div class="table-responsive">
        <table class="table table-vcenter card-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th class="w-1"></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>John Doe</td>
                    <td class="text-secondary">john@example.com</td>
                    <td>
                        <span class="badge bg-success me-1"></span> Active
                    </td>
                    <td>
                        <a href="#">Edit</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
```

**Table classes:**
- `.table` — base styling
- `.table-vcenter` — vertically center cells
- `.card-table` — flush with card edges (no card-body needed)
- `.table-responsive` — horizontal scroll on small screens
- `.table-nowrap` — prevent cell wrapping
- `.table-striped` — alternating row backgrounds
- `.table-hover` — highlight on hover

### Avatars

```html
<!-- Sizes -->
<span class="avatar avatar-xs">AB</span>
<span class="avatar avatar-sm">AB</span>
<span class="avatar">AB</span>
<span class="avatar avatar-lg">AB</span>
<span class="avatar avatar-xl">AB</span>

<!-- With image -->
<span class="avatar" style="background-image: url(photo.jpg)"></span>

<!-- With status -->
<span class="avatar">AB
    <span class="badge bg-green"></span>
</span>

<!-- Colored backgrounds -->
<span class="avatar bg-blue-lt">AB</span>
<span class="avatar bg-green-lt">AB</span>
<span class="avatar bg-red-lt">AB</span>

<!-- Avatar list -->
<div class="avatar-list">
    <span class="avatar">A</span>
    <span class="avatar">B</span>
    <span class="avatar">C</span>
</div>

<!-- Stacked avatar list -->
<div class="avatar-list avatar-list-stacked">
    <span class="avatar">A</span>
    <span class="avatar">B</span>
    <span class="avatar">+3</span>
</div>
```

### Badges

```html
<!-- Color variants -->
<span class="badge bg-blue">Blue</span>
<span class="badge bg-green">Green</span>
<span class="badge bg-red">Red</span>
<span class="badge bg-yellow">Yellow</span>

<!-- Light variants (subtle) -->
<span class="badge bg-blue-lt">Blue</span>
<span class="badge bg-green-lt">Green</span>

<!-- Sizes -->
<span class="badge badge-sm bg-primary">Small</span>
<span class="badge bg-primary">Default</span>
<span class="badge badge-lg bg-primary">Large</span>

<!-- Pill shape -->
<span class="badge badge-pill bg-primary">Pill</span>

<!-- Notification badge (positioned) -->
<a class="btn btn-icon" href="#">
    <svg><!-- icon --></svg>
    <span class="badge bg-red badge-notification badge-blink"></span>
</a>

<!-- Empty dot -->
<span class="badge bg-red badge-notification"></span>
```

### Alerts

```html
<!-- Standard alerts -->
<div class="alert alert-success">Success message</div>
<div class="alert alert-info">Info message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-danger">Danger message</div>

<!-- Dismissible -->
<div class="alert alert-success alert-dismissible">
    <div class="d-flex">
        <div><svg class="alert-icon"><!-- icon --></svg></div>
        <div>Success with icon and close button</div>
    </div>
    <a class="btn-close" data-bs-dismiss="alert"></a>
</div>

<!-- Important (solid background) -->
<div class="alert alert-important alert-success">
    High-visibility success message
    <a class="btn-close btn-close-white" data-bs-dismiss="alert"></a>
</div>
```

### Status Indicators

```html
<!-- Inline status -->
<span class="status status-green">Active</span>
<span class="status status-red">Offline</span>
<span class="status status-yellow">Pending</span>

<!-- With animated dot -->
<span class="status status-green">
    <span class="status-dot status-dot-animated"></span> Live
</span>

<!-- Standalone dots -->
<span class="status-dot status-green"></span>
<span class="status-dot status-red"></span>

<!-- Available colors: blue, azure, indigo, purple, pink, red,
     orange, yellow, lime, green, teal, cyan -->
```

### Progress Bars

```html
<div class="progress">
    <div class="progress-bar" style="width: 57%" role="progressbar">57%</div>
</div>

<!-- Colored -->
<div class="progress">
    <div class="progress-bar bg-green" style="width: 75%"></div>
</div>

<!-- Small (in tables/lists) -->
<div class="progress progress-sm">
    <div class="progress-bar bg-primary" style="width: 43%"></div>
</div>
```

### Modals

```html
<!-- Trigger -->
<a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-report">
    Open Modal
</a>

<!-- Modal -->
<div class="modal" id="modal-report" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Modal Title</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">Content</div>
            <div class="modal-footer">
                <a href="#" class="btn btn-link" data-bs-dismiss="modal">Cancel</a>
                <a href="#" class="btn btn-primary">Submit</a>
            </div>
        </div>
    </div>
</div>

<!-- Danger confirmation -->
<div class="modal" id="modal-danger" tabindex="-1">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-status bg-danger"></div>
            <div class="modal-body text-center py-4">
                <svg class="icon text-danger icon-lg mb-2"><!-- alert icon --></svg>
                <h3>Are you sure?</h3>
                <div class="text-secondary">This action cannot be undone.</div>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-link" data-bs-dismiss="modal">Cancel</a>
                <a href="#" class="btn btn-danger">Delete</a>
            </div>
        </div>
    </div>
</div>
```

**Sizes:** `.modal-sm`, default, `.modal-lg`, `.modal-full-width`

### Forms

```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Settings</h3>
    </div>
    <div class="card-body">
        <!-- Text input -->
        <div class="mb-3">
            <label class="form-label">Name</label>
            <input type="text" class="form-control" placeholder="Enter name">
        </div>

        <!-- Select -->
        <div class="mb-3">
            <label class="form-label">Role</label>
            <select class="form-select">
                <option>Admin</option>
                <option>User</option>
            </select>
        </div>

        <!-- Switch -->
        <div class="mb-3">
            <label class="form-check form-switch">
                <input class="form-check-input" type="checkbox" checked>
                <span class="form-check-label">Enable notifications</span>
            </label>
        </div>

        <!-- Input with icon -->
        <div class="mb-3">
            <label class="form-label">Search</label>
            <div class="input-icon">
                <span class="input-icon-addon">
                    <svg><!-- search icon --></svg>
                </span>
                <input type="text" class="form-control" placeholder="Search...">
            </div>
        </div>

        <!-- Input group -->
        <div class="mb-3">
            <label class="form-label">Website</label>
            <div class="input-group">
                <span class="input-group-text">https://</span>
                <input type="text" class="form-control" placeholder="example.com">
            </div>
        </div>
    </div>
    <div class="card-footer text-end">
        <a href="#" class="btn btn-link">Cancel</a>
        <button type="submit" class="btn btn-primary">Save</button>
    </div>
</div>
```

**Input variants:**
- `.form-control` — standard input
- `.form-control-rounded` — rounded corners
- `.form-control-flush` — borderless
- `.form-control-lg` / `.form-control-sm` — sizes

### Dropdowns

```html
<div class="dropdown">
    <a href="#" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
        Actions
    </a>
    <div class="dropdown-menu">
        <a class="dropdown-item" href="#">
            <svg class="dropdown-item-icon"><!-- icon --></svg> Edit
        </a>
        <a class="dropdown-item" href="#">
            <svg class="dropdown-item-icon"><!-- icon --></svg> Duplicate
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item text-danger" href="#">
            <svg class="dropdown-item-icon"><!-- icon --></svg> Delete
        </a>
    </div>
</div>
```

### Empty States

```html
<div class="card">
    <div class="card-body">
        <div class="empty">
            <div class="empty-icon">
                <svg><!-- large icon --></svg>
            </div>
            <p class="empty-title">No results found</p>
            <p class="empty-subtitle text-secondary">
                Try adjusting your search or filters.
            </p>
            <div class="empty-action">
                <a href="#" class="btn btn-primary">
                    <svg><!-- plus icon --></svg> Add item
                </a>
            </div>
        </div>
    </div>
</div>
```

### Ribbons

```html
<div class="card">
    <div class="ribbon bg-red">NEW</div>
    <div class="card-body">Card with ribbon</div>
</div>

<!-- Positions: ribbon-top, ribbon-end, ribbon-bottom, ribbon-start -->
<!-- Variant: ribbon-bookmark -->
<div class="card">
    <div class="ribbon ribbon-top ribbon-bookmark bg-green">
        <svg><!-- icon --></svg>
    </div>
    <div class="card-body">Bookmarked</div>
</div>
```

### Steps / Wizard

```html
<div class="steps steps-green steps-counter" data-progress="3">
    <a href="#" class="step-item active">Account</a>
    <a href="#" class="step-item active">Profile</a>
    <a href="#" class="step-item active">Settings</a>
    <a href="#" class="step-item">Complete</a>
</div>
```

### Pagination

```html
<ul class="pagination">
    <li class="page-item disabled"><a class="page-link" href="#">Prev</a></li>
    <li class="page-item"><a class="page-link" href="#">1</a></li>
    <li class="page-item active"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#">Next</a></li>
</ul>
```

## Icons

Tabler includes 5000+ stroke icons. Use inline SVGs:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
     viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
     class="icon">
    <path d="..."/>
</svg>
```

**Icon sizing classes:** `icon-sm` (16px), `icon` (24px default), `icon-lg` (32px), `icon-xl` (48px)

**Icon colors:** Wrap in `<span class="text-red">`, `<span class="text-green">`, etc.

**Icon animations:** Add class `icon-pulse`, `icon-tada`, or `icon-rotate` to the SVG.

**Finding icons:** Browse at https://tabler.io/icons — copy the SVG code directly.

**Common icons used in this project:**
- Settings gear: `<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0..."/>`
- User: `<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>`
- Home: `<path d="M5 12l-2 0l9 -9l9 9l-2 0"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/>`
- Search: `<path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/><path d="M21 21l-6 -6"/>`

## Charts (ApexCharts)

Tabler integrates with ApexCharts. This project also uses Chart.js for sparklines.

```html
{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
    new ApexCharts(document.getElementById('chart-revenue'), {
        chart: { type: 'area', height: 240, animations: { enabled: false } },
        series: [{ name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] }],
        xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        colors: [getComputedStyle(document.documentElement).getPropertyValue('--tblr-primary').trim()],
        stroke: { width: 2, curve: 'smooth' },
        fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0 } },
        grid: { strokeDashArray: 4 },
        legend: { position: 'bottom' }
    }).render();
});
</script>
{% endblock %}
```

**Theme-aware colors:** Always read `--tblr-primary` at runtime so charts adapt to color scheme changes.

## Color System

### Named Colors (use with `bg-*`, `text-*`, `btn-*`)

| Color | Hex | Light variant |
|-------|-----|---------------|
| blue | `#206bc4` | `bg-blue-lt` |
| azure | `#4299e1` | `bg-azure-lt` |
| indigo | `#4263eb` | `bg-indigo-lt` |
| purple | `#ae3ec9` | `bg-purple-lt` |
| pink | `#d6336c` | `bg-pink-lt` |
| red | `#d63939` | `bg-red-lt` |
| orange | `#f76707` | `bg-orange-lt` |
| yellow | `#f59f00` | `bg-yellow-lt` |
| lime | `#74b816` | `bg-lime-lt` |
| green | `#2fb344` | `bg-green-lt` |
| teal | `#0ca678` | `bg-teal-lt` |
| cyan | `#17a2b8` | `bg-cyan-lt` |

**Light variants** (`-lt` suffix) use the color at ~10% opacity — perfect for backgrounds, avatar initials, and subtle highlights.

### Semantic Colors

| Class | Purpose |
|-------|---------|
| `bg-primary` / `text-primary` | Accent color (changes with scheme) |
| `bg-success` / `text-success` | Green — positive states |
| `bg-warning` / `text-warning` | Yellow — caution |
| `bg-danger` / `text-danger` | Red — errors, destructive |
| `bg-info` / `text-info` | Blue — informational |
| `text-secondary` | Muted text |
| `text-muted` | Even more muted |

### Dark Mode Variables (from `tabler_overrides.css`)

```css
body.theme-dark {
    --tblr-body-bg: var(--tblr-gray-800);       /* Page background */
    --tblr-bg-surface: var(--tblr-gray-700);    /* Elevated surfaces */
    --tblr-card-bg: var(--tblr-gray-700);       /* Card backgrounds */
    --tblr-body-color: var(--tblr-gray-200);    /* Primary text */
    --tblr-border-color: var(--tblr-gray-600);  /* Borders */
    --tblr-muted: var(--tblr-gray-400);         /* Muted text */
}
```

## Utility Classes Quick Reference

### Spacing
Bootstrap 5 standard: `m-{0-5}`, `p-{0-5}`, `mt-3`, `px-4`, `mb-auto`, etc.

### Flexbox
`d-flex`, `align-items-center`, `justify-content-between`, `flex-column`, `gap-2`

### Grid
`row`, `col-{breakpoint}-{1-12}`, `row-deck` (equal height), `row-cards`, `g-2` (gap)

### Display
`d-none`, `d-sm-block`, `d-print-none`, `d-inline-flex`

### Text
`text-center`, `text-end`, `text-secondary`, `text-muted`, `fw-bold`, `fs-3`, `text-truncate`

### Sizing
`w-100`, `w-1` (minimal), `h-100`, `mw-100`

## Interactivity Patterns

### HTMX Integration

The base template loads htmx and sets CSRF headers automatically:
```html
<body hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
```

**Inline editing:**
```html
<td hx-get="{% url 'app:edit' obj.pk %}" hx-trigger="click" hx-swap="innerHTML">
    {{ obj.name }}
</td>
```

**Live search:**
```html
<div class="input-icon">
    <span class="input-icon-addon"><svg><!-- search --></svg></span>
    <input type="search" class="form-control"
           hx-get="{% url 'app:search' %}"
           hx-trigger="keyup changed delay:300ms"
           hx-target="#results"
           placeholder="Search...">
</div>
<div id="results"></div>
```

**Load more / infinite scroll:**
```html
<div hx-get="{% url 'app:list' %}?page={{ next_page }}"
     hx-trigger="revealed"
     hx-swap="afterend">
    Loading...
</div>
```

### Offcanvas (Slide-out Panels)

```html
<a href="#" data-bs-toggle="offcanvas" data-bs-target="#offcanvas-details">
    View Details
</a>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas-details">
    <div class="offcanvas-header">
        <h2 class="offcanvas-title">Details</h2>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
        Content loaded here (can use hx-get for dynamic content)
    </div>
</div>
```

### Toasts (Notifications)

```html
<div class="toast show" role="alert">
    <div class="toast-header">
        <span class="avatar avatar-xs bg-primary me-2">N</span>
        <strong class="me-auto">Notification</strong>
        <small>just now</small>
        <button type="button" class="ms-2 btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">Operation completed successfully.</div>
</div>
```

### Tabs with Dynamic Content

```html
<div class="card">
    <div class="card-header">
        <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
                <a class="nav-link active" href="#tab-overview"
                   data-bs-toggle="tab">Overview</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#tab-activity"
                   hx-get="{% url 'app:activity_partial' %}"
                   hx-target="#tab-activity"
                   hx-trigger="click once"
                   data-bs-toggle="tab">Activity</a>
            </li>
        </ul>
    </div>
    <div class="card-body">
        <div class="tab-content">
            <div class="tab-pane active" id="tab-overview">Static content</div>
            <div class="tab-pane" id="tab-activity">Loading...</div>
        </div>
    </div>
</div>
```

## Complete Page Examples

### Dashboard with Stats + Table

```html
{% extends "tabler/base.html" %}
{% load static theme_tags %}

{% block title %}Dashboard{% endblock %}

{% block page_header %}
<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="row g-2 align-items-center">
            <div class="col">
                <div class="page-pretitle">Overview</div>
                <h2 class="page-title">Dashboard</h2>
            </div>
        </div>
    </div>
</div>
{% endblock %}

{% block content %}
<!-- Stat row -->
<div class="row row-deck row-cards">
    <div class="col-sm-6 col-lg-3">
        <div class="card card-sm">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <span class="bg-primary text-white avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"/><path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/></svg>
                        </span>
                    </div>
                    <div class="col">
                        <div class="font-weight-medium">{{ user_count }} users</div>
                        <div class="text-secondary">{{ new_today }} new today</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-lg-3">
        <div class="card card-sm">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-auto">
                        <span class="bg-green text-white avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/><path d="M9 12l2 2l4 -4"/></svg>
                        </span>
                    </div>
                    <div class="col">
                        <div class="font-weight-medium">{{ uptime }}% uptime</div>
                        <div class="text-secondary">Last 30 days</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Data table -->
<div class="row row-deck row-cards mt-3">
    <div class="col-12">
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Recent Activity</h3>
                <div class="card-actions">
                    <a href="{% url 'activity:dashboard' %}" class="btn btn-outline-primary btn-sm">
                        View All
                    </a>
                </div>
            </div>
            <div class="table-responsive">
                <table class="table table-vcenter card-table table-striped">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for event in events %}
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <span class="avatar avatar-sm me-2 bg-primary-lt">
                                        {{ event.user.username|make_list|first|upper }}
                                    </span>
                                    {{ event.user.username }}
                                </div>
                            </td>
                            <td>{{ event.action }}</td>
                            <td class="text-secondary">{{ event.timestamp|timesince }} ago</td>
                            <td>
                                {% if event.success %}
                                <span class="badge bg-success-lt">OK</span>
                                {% else %}
                                <span class="badge bg-danger-lt">Error</span>
                                {% endif %}
                            </td>
                        </tr>
                        {% empty %}
                        <tr>
                            <td colspan="4">
                                <div class="empty">
                                    <p class="empty-title">No activity yet</p>
                                </div>
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

### Form Page

```html
{% extends "tabler/base.html" %}
{% load static theme_tags %}

{% block title %}Edit {{ object }}{% endblock %}

{% block page_header %}
<div class="page-header d-print-none">
    <div class="container-xl">
        <div class="row g-2 align-items-center">
            <div class="col">
                <div class="page-pretitle">Settings</div>
                <h2 class="page-title">Edit {{ object }}</h2>
            </div>
        </div>
    </div>
</div>
{% endblock %}

{% block content %}
<div class="row">
    <div class="col-lg-8">
        <form method="post">
            {% csrf_token %}
            <div class="card">
                <div class="card-body">
                    {% for field in form %}
                    <div class="mb-3">
                        <label class="form-label {% if field.field.required %}required{% endif %}">
                            {{ field.label }}
                        </label>
                        {{ field }}
                        {% if field.help_text %}
                        <small class="form-hint">{{ field.help_text }}</small>
                        {% endif %}
                        {% if field.errors %}
                        <div class="invalid-feedback d-block">{{ field.errors.0 }}</div>
                        {% endif %}
                    </div>
                    {% endfor %}
                </div>
                <div class="card-footer text-end">
                    <a href="{{ cancel_url }}" class="btn btn-link">Cancel</a>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                </div>
            </div>
        </form>
    </div>
    <div class="col-lg-4">
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Help</h4>
                <p class="text-secondary">
                    Fill in the form fields and click Save to update.
                </p>
            </div>
        </div>
    </div>
</div>
{% endblock %}
```

## Rules

1. **Always extend `tabler/base.html`** for pages in this project.
2. **Use Bootstrap 5 grid** (`row`, `col-*`) for layout. Use `row-deck row-cards` for card grids.
3. **Use Tabler component classes** — don't reinvent cards, tables, badges, buttons.
4. **Never hardcode colors.** Use `bg-*`, `text-*` utilities or CSS variables.
5. **Dark mode is automatic.** If using custom CSS, scope overrides under `body.theme-dark` or use `[data-bs-theme='dark']`.
6. **Use `card-table`** class for tables inside cards — it removes card-body padding and aligns flush.
7. **Keep page-specific CSS in `{% block extra_css %}`** — don't create new CSS files for one page.
8. **Use `d-print-none`** on navigation, actions, and anything not useful in print.
9. **Prefer `-lt` badge/avatar variants** for subtle, theme-friendly highlighting.
10. **Use `text-secondary`** for secondary information, `text-muted` for tertiary.

## Related Skills

- [upstream-workflow.md](upstream-workflow.md) — How to merge upstream SmallStack changes
- [building-themed-pages.md](building-themed-pages.md) — SmallStack's original theming (for reference)
- [adding-your-own-theme.md](adding-your-own-theme.md) — Generic guide for adding any theme
- [templates.md](templates.md) — Django template inheritance and blocks
- [htmx-patterns.md](htmx-patterns.md) — htmx patterns for interactivity
- [components.md](components.md) — SmallStack component reference
