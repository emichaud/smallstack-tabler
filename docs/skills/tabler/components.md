# Tabler Components — comprehensive reference

**Use this skill when** building any UI element: cards, buttons, badges, alerts, dropdowns, modals, offcanvas, tabs, accordions, popovers, tooltips, steps, ribbons, status indicators, empty states, timelines, lightbox, carousels, etc.

For deep dives on forms and tables, see [forms.md](forms.md) and [tables.md](tables.md). For icons and typography, see [icons-typography.md](icons-typography.md).

## Tabler references

- Component index: https://docs.tabler.io/ui/components
- Preview demos: https://preview.tabler.io/cards.html, /buttons.html, /modals.html, etc.

## Cards — the universal container

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Title</h3>
    <div class="card-actions">
      <a href="#" class="btn btn-outline-primary btn-sm">Action</a>
    </div>
  </div>
  <div class="card-body">Body</div>
  <div class="card-footer">Footer</div>
</div>
```

### Card sizing
- `.card-sm` — compact (smaller padding)
- default — normal
- `.card-lg` — spacious (use sparingly)
- `.card-md` — used for auth screens (login card width)

### Status indicators
```html
<!-- Top stripe -->
<div class="card">
  <div class="card-status-top bg-primary"></div>
  ...
</div>

<!-- Left stripe -->
<div class="card">
  <div class="card-status-start bg-green"></div>
  ...
</div>

<!-- Colors: primary, secondary, success, warning, danger, info, blue, azure, indigo, purple, pink, red, orange, yellow, lime, green, teal, cyan -->
```

### Card layout helpers
- `.card-link` — entire card becomes a clickable link (anchor)
- `.card-link-rotate` — rotates SVG on hover
- `.card-stacked` — visual "stack of papers" effect
- `.card-active` — emphasized appearance (border + shadow)
- `.card-borderless` — no border
- `.card-rotate-left` / `.card-rotate-right` — slight rotation effect
- `.card-cover` — full-bleed image header
- `.card-cover-blurred` — blurred backdrop image

### Card grid (always use)
```html
<div class="row row-deck row-cards">
  <div class="col-12 col-md-6 col-lg-4">
    <div class="card"> ... </div>
  </div>
</div>
```

`row-deck` makes all cards equal height; `row-cards` applies appropriate gutters.

### Card with tabs in header
```html
<div class="card">
  <div class="card-header">
    <ul class="nav nav-tabs card-header-tabs">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="tab" href="#tab-1">Overview</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="tab" href="#tab-2">Activity</a>
      </li>
    </ul>
  </div>
  <div class="card-body">
    <div class="tab-content">
      <div class="tab-pane active" id="tab-1">Overview content</div>
      <div class="tab-pane" id="tab-2">Activity content</div>
    </div>
  </div>
</div>
```

### Card with table flush
```html
<div class="card">
  <div class="card-header"><h3 class="card-title">Users</h3></div>
  <div class="table-responsive">
    <table class="table card-table table-vcenter">
      ...
    </table>
  </div>
</div>
```

`.card-table` removes the body-padding wrap around the table.

## Buttons

```html
<a class="btn btn-primary">Primary</a>
<a class="btn btn-outline-primary">Outline</a>
<a class="btn btn-ghost-primary">Ghost</a>
```

### Color variants
`btn-primary` `btn-secondary` `btn-success` `btn-warning` `btn-danger` `btn-info` `btn-light` `btn-dark`

### Extended palette
`btn-blue` `btn-azure` `btn-indigo` `btn-purple` `btn-pink` `btn-red` `btn-orange` `btn-yellow` `btn-lime` `btn-green` `btn-teal` `btn-cyan` `btn-amber`

### Sizes
`btn-xs` `btn-sm` (default) `btn-lg` `btn-xl`

### Shapes
`btn-pill` `btn-square` `btn-icon` (icon-only square)

### States / modifiers
`btn-loading` (spinner overlay) — disable text shifts.

### Button groups
```html
<div class="btn-list">
  <a class="btn btn-primary">Save</a>
  <a class="btn btn-link">Cancel</a>
</div>

<div class="btn-group">
  <a class="btn btn-outline-primary active">Day</a>
  <a class="btn btn-outline-primary">Week</a>
  <a class="btn btn-outline-primary">Month</a>
</div>

<!-- Vertical -->
<div class="btn-group-vertical">
  <a class="btn">Top</a>
  <a class="btn">Bottom</a>
</div>
```

## Badges

```html
<span class="badge bg-blue">Blue</span>
<span class="badge bg-green-lt">Subtle green</span>
<span class="badge bg-red badge-pill">Pill</span>
<span class="badge bg-red badge-notification badge-blink"></span>
```

- `-lt` suffix → light/subtle background variant
- `badge-pill` → rounded
- `badge-blink` → pulsing
- `badge-notification` → small dot, absolutely positioned

### Sizes
`badge-sm` (default) `badge-lg`

## Avatars

```html
<!-- Sizes: avatar-xs, avatar-sm, avatar (default), avatar-md, avatar-lg, avatar-xl, avatar-2xl -->

<!-- Initials -->
<span class="avatar avatar-sm bg-primary-lt">AB</span>

<!-- Image -->
<span class="avatar" style="background-image: url(/static/img/face.jpg)"></span>

<!-- Square -->
<span class="avatar avatar-rounded-0">AB</span>

<!-- Status dot -->
<span class="avatar">
  AB
  <span class="badge bg-green badge-notification"></span>
</span>

<!-- Stacked list -->
<div class="avatar-list avatar-list-stacked">
  <span class="avatar avatar-sm">A</span>
  <span class="avatar avatar-sm">B</span>
  <span class="avatar avatar-sm">+5</span>
</div>
```

## Alerts

```html
<div class="alert alert-success">Saved successfully</div>
<div class="alert alert-warning">Caution: production data</div>
<div class="alert alert-danger">Failed to process</div>
<div class="alert alert-info">FYI</div>

<!-- With icon + dismissible -->
<div class="alert alert-success alert-dismissible">
  <div class="d-flex">
    <div><svg class="alert-icon">...</svg></div>
    <div>Operation completed</div>
  </div>
  <a class="btn-close" data-bs-dismiss="alert"></a>
</div>

<!-- Important (high-contrast solid) -->
<div class="alert alert-important alert-danger">
  Production deletion confirmed
  <a class="btn-close btn-close-white" data-bs-dismiss="alert"></a>
</div>
```

Django messages → Tabler alerts: see `tabler/includes/messages.html` for the conversion pattern.

## Dropdowns

```html
<div class="dropdown">
  <a href="#" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
    Actions
  </a>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="#"><svg class="dropdown-item-icon">...</svg> Edit</a>
    <a class="dropdown-item" href="#">Duplicate</a>
    <div class="dropdown-divider"></div>
    <a class="dropdown-item text-danger" href="#">Delete</a>
  </div>
</div>
```

### Variants
- `dropdown-menu-end` — right-aligned
- `dropdown-menu-arrow` — visible arrow caret
- `dropdown-menu-card` — looks like a card (use for rich content)
- `dropdown-menu-columns` — multi-column dropdown
- `data-bs-auto-close="outside"` — keeps menu open until click outside (good for forms inside dropdowns)

### Rich dropdown (apps grid)
See `apps/tabler/templates/tabler/includes/navbar.html` lines 85-105 — the apps-grid dropdown uses `.dropdown-apps-grid` + `.dropdown-apps-item` (custom, defined in `tabler_overrides.css`).

## Modals

```html
<!-- Trigger -->
<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modal-edit">
  Open
</button>

<!-- Modal -->
<div class="modal fade" id="modal-edit" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit User</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">Content</div>
      <div class="modal-footer">
        <button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-primary">Save</button>
      </div>
    </div>
  </div>
</div>
```

### Sizes
- `modal-sm` `modal-md` (default) `modal-lg` `modal-xl`
- `modal-full-width` — full viewport width
- `modal-dialog-centered` — vertical center
- `modal-dialog-scrollable` — scrollable body

### Status-colored modal
```html
<div class="modal-content">
  <div class="modal-status bg-danger"></div>
  <div class="modal-body text-center py-4">
    <svg class="icon mb-2 text-danger icon-lg"></svg>
    <h3>Are you sure?</h3>
    <div class="text-secondary">This will permanently delete the record.</div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>
    <button class="btn btn-danger">Delete</button>
  </div>
</div>
```

### Loading content via htmx
```html
<a class="btn btn-primary"
   hx-get="{% url 'myapp:edit_partial' obj.pk %}"
   hx-target="#modal-edit-body"
   data-bs-toggle="modal" data-bs-target="#modal-edit">
  Edit
</a>

<div class="modal" id="modal-edit">
  <div class="modal-dialog">
    <div class="modal-content">
      <div id="modal-edit-body">Loading...</div>
    </div>
  </div>
</div>
```

## Offcanvas (slide-out panels)

```html
<a data-bs-toggle="offcanvas" data-bs-target="#offcanvas-details">View</a>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvas-details">
  <div class="offcanvas-header">
    <h2 class="offcanvas-title">Details</h2>
    <button class="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>
  <div class="offcanvas-body">Content</div>
</div>
```

### Positions
`offcanvas-start` `offcanvas-end` (default in this project) `offcanvas-top` `offcanvas-bottom`

### Sizes
`offcanvas-narrow` `offcanvas-wide` `offcanvas-fullscreen`

The settings panel uses `offcanvas-end offcanvas-narrow` — see `tabler/includes/settings.html`.

## Tabs

```html
<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" data-bs-toggle="tab" href="#tab-1">Tab 1</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-bs-toggle="tab" href="#tab-2">Tab 2</a>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane active" id="tab-1">Content 1</div>
  <div class="tab-pane" id="tab-2">Content 2</div>
</div>
```

### Variants
- `nav-pills` — pill-shaped instead of underline
- `nav-fill` / `nav-justified` — equal-width tabs
- `nav-bordered` — bordered container
- `nav-tabs-alt` — alternative underline style

### Lazy-load tabs with htmx
```html
<a class="nav-link" data-bs-toggle="tab" href="#tab-activity"
   hx-get="{% url 'myapp:activity_partial' %}"
   hx-target="#tab-activity"
   hx-trigger="click once">Activity</a>
```

`hx-trigger="click once"` ensures the load happens only the first time.

## Accordions

```html
<div class="accordion" id="accordion-faq">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" data-bs-toggle="collapse" data-bs-target="#item-1">
        Question 1
      </button>
    </h2>
    <div id="item-1" class="accordion-collapse collapse show" data-bs-parent="#accordion-faq">
      <div class="accordion-body">Answer</div>
    </div>
  </div>
</div>
```

### Variants
- `accordion-flush` — no borders, edge-to-edge
- Remove `data-bs-parent` to allow multiple items open simultaneously

## Popovers & Tooltips

Tabler auto-initializes any element with `data-bs-toggle="tooltip"` or `data-bs-toggle="popover"`:

```html
<button class="btn" data-bs-toggle="tooltip" title="Helpful text">Hover me</button>

<button class="btn" data-bs-toggle="popover"
        data-bs-title="Title"
        data-bs-content="Body text">Click me</button>
```

If you load content via htmx, Tabler doesn't auto-init the new nodes. Re-init after swap:

```js
document.body.addEventListener('htmx:afterSwap', function(e) {
  e.target.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el =>
    new bootstrap.Tooltip(el)
  );
});
```

See [htmx-patterns.md](htmx-patterns.md) for the full re-init pattern.

## Steps / wizard

```html
<div class="steps steps-counter steps-green" data-progress="3">
  <a href="#" class="step-item active">Account</a>
  <a href="#" class="step-item active">Profile</a>
  <a href="#" class="step-item active">Plan</a>
  <a href="#" class="step-item">Confirm</a>
</div>
```

### Color variants
`steps-blue` `steps-azure` ... `steps-cyan`

### Layout variants
- `steps-vertical` — stacked
- `steps-counter` — numbered circles instead of dots

## Ribbons

```html
<div class="card">
  <div class="ribbon bg-red">NEW</div>
  <div class="card-body">Content</div>
</div>

<!-- Positions: ribbon-top, ribbon-end, ribbon-bottom, ribbon-start -->
<!-- Variants: ribbon-bookmark (folded look) -->

<div class="card">
  <div class="ribbon ribbon-top ribbon-bookmark bg-green">
    <svg class="icon">...</svg>
  </div>
  <div class="card-body">Bookmarked</div>
</div>
```

## Status indicators

```html
<!-- Inline -->
<span class="status status-green">Live</span>
<span class="status status-red">Down</span>

<!-- Animated dot -->
<span class="status status-green">
  <span class="status-dot status-dot-animated"></span> Streaming
</span>

<!-- Standalone dot -->
<span class="status-dot status-yellow"></span>
```

Available colors match the named palette: blue, azure, indigo, purple, pink, red, orange, yellow, lime, green, teal, cyan.

## Empty states

```html
<div class="empty">
  <div class="empty-img">
    <img src="{% static 'img/undraw_empty.svg' %}" alt="">
  </div>
  <p class="empty-title">No results found</p>
  <p class="empty-subtitle text-secondary">
    Try adjusting your search or filters.
  </p>
  <div class="empty-action">
    <a href="#" class="btn btn-primary">
      <svg class="icon">...</svg> Add item
    </a>
  </div>
</div>
```

Use inside a `.card-body` for centered, contextual empty states. Use inside a `<td colspan="...">` for empty tables.

## Timelines

```html
<ul class="timeline">
  <li class="timeline-event">
    <div class="timeline-event-icon bg-primary-lt">
      <svg class="icon">...</svg>
    </div>
    <div class="card timeline-event-card">
      <div class="card-body">
        <div class="text-secondary float-end">2h ago</div>
        <h4>Order created</h4>
        <p>Order #1234 placed by John Doe.</p>
      </div>
    </div>
  </li>
  <li class="timeline-event">
    <div class="timeline-event-icon bg-success-lt">
      <svg class="icon">...</svg>
    </div>
    <div class="card timeline-event-card">
      <div class="card-body">
        <div class="text-secondary float-end">1h ago</div>
        <h4>Payment processed</h4>
      </div>
    </div>
  </li>
</ul>
```

Heartbeat's backup history is a good in-repo example: `apps/tabler/templates/smallstack/backup_detail.html`.

## Progress bars

```html
<div class="progress">
  <div class="progress-bar" style="width: 57%" role="progressbar" aria-valuenow="57"></div>
</div>

<!-- Sizes -->
<div class="progress progress-sm"> ... </div>
<div class="progress progress-lg"> ... </div>

<!-- Colored -->
<div class="progress">
  <div class="progress-bar bg-green" style="width: 75%"></div>
</div>

<!-- Multi-segment (for usage breakdowns) -->
<div class="progress">
  <div class="progress-bar bg-primary" style="width: 35%"></div>
  <div class="progress-bar bg-info" style="width: 25%"></div>
  <div class="progress-bar bg-yellow" style="width: 15%"></div>
</div>

<!-- Striped + animated -->
<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" style="width: 50%"></div>
</div>
```

## Carousel

```html
<div id="carousel-example" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carousel-example" data-bs-slide-to="0" class="active"></button>
    <button type="button" data-bs-target="#carousel-example" data-bs-slide-to="1"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="..." class="d-block w-100" alt="">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carousel-example" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carousel-example" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>
</div>
```

## Toasts

```html
<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div class="toast" role="alert">
    <div class="toast-header">
      <span class="avatar avatar-xs bg-primary me-2">N</span>
      <strong class="me-auto">Notification</strong>
      <small>just now</small>
      <button class="btn-close" data-bs-dismiss="toast"></button>
    </div>
    <div class="toast-body">Saved successfully</div>
  </div>
</div>
```

Show programmatically:
```js
const toast = new bootstrap.Toast(document.querySelector('.toast'));
toast.show();
```

See [htmx-patterns.md](htmx-patterns.md) for triggering toasts from server responses.

## Lightbox (image viewer)

Tabler bundles GLightbox. Trigger via class:

```html
<a href="/static/img/photo-full.jpg" class="glightbox" data-glightbox="title: My Photo">
  <img src="/static/img/photo-thumb.jpg" alt="">
</a>
```

GLightbox auto-initializes on `.glightbox` elements.

## Spinner / loading

```html
<div class="spinner-border" role="status"></div>
<div class="spinner-grow" role="status"></div>

<!-- Colors -->
<div class="spinner-border text-primary"></div>

<!-- Dot pulse -->
<div class="spinner-dot"></div>

<!-- Loader (Tabler-specific) -->
<div class="page-loader"><div class="loader"></div></div>
```

## Pagination

```html
<ul class="pagination">
  <li class="page-item disabled">
    <a class="page-link" href="#">
      <svg class="icon">...</svg> Prev
    </a>
  </li>
  <li class="page-item"><a class="page-link" href="#">1</a></li>
  <li class="page-item active"><a class="page-link" href="#">2</a></li>
  <li class="page-item"><a class="page-link" href="#">3</a></li>
  <li class="page-item">
    <a class="page-link" href="#">Next <svg class="icon">...</svg></a>
  </li>
</ul>
```

In SmallStack, use `{% render_paginator page_obj %}` from `theme_tags` — see `apps/smallstack/templatetags/theme_tags.py` lines 170-184 and `apps/smallstack/templates/smallstack/includes/paginator.html`.

## Markdown rendering

For blog/docs/help pages, the SmallStack help system already renders markdown. See [page-content.md](page-content.md) for the rendering pipeline.

## Gotchas

- **Bootstrap JS is auto-init for elements present at page load only.** Tooltips, popovers, dropdowns, modals, offcanvas, tabs, toasts, accordions all init from `data-bs-toggle`. After an htmx swap, you must re-init — see [htmx-patterns.md](htmx-patterns.md).
- **Modals and offcanvas use `aria-hidden` automatically** — don't manually toggle visibility with `display: none` or you'll break the focus management.
- **`btn-loading` requires preserving the button text** — text is hidden via CSS, the spinner overlays. If you also disable the button via JS, the spinner still shows.
- **Light variants (`-lt`) work on `bg-*` and `text-*` but not on `btn-*`** — there's no `btn-primary-lt`. Use `btn-outline-primary` or `btn-ghost-primary` instead.
- **Avatars are inline by default** — wrap in a `<div>` if you want them block-level.
- **Carousel auto-cycle (`data-bs-ride="carousel"`) starts on visibility, not load** — useful for tabs containing carousels.
- **`tab-pane` must have a unique `id`** — used as the `href` target.
- **Timelines need both `.timeline-event-icon` AND `.card.timeline-event-card`** — missing the card breaks the connecting line.

## Related skills

- [forms.md](forms.md) — for form-specific components
- [tables.md](tables.md) — for table-specific components
- [icons-typography.md](icons-typography.md) — for icons used inside these components
- [htmx-patterns.md](htmx-patterns.md) — for re-initializing components after swap
- [theming.md](theming.md) — for the color palette these components use
