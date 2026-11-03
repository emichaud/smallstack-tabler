# Tables — sortable, paginated, datatables, htmx-driven, CRUD integration

**Use this skill when** building a list view, log viewer, data explorer, or any tabular presentation of records.

## Tabler references

- Docs: https://docs.tabler.io/ui/components/tables
- Preview: https://preview.tabler.io/tables.html
- Preview: https://preview.tabler.io/datatables.html

## In-repo examples

- `apps/tabler/templates/smallstack/crud/object_list.html` — canonical CRUD list with sorting, pagination, filters
- `apps/tabler/templates/smallstack/crud/_table_styles.html` — shared table CSS overrides (loaded by CRUD templates)
- `apps/tabler/templates/smallstack/crud/includes/sortable_th.html` — sortable header component
- `apps/tabler/templates/smallstack/crud/includes/field_preview_modal.html` — truncated-field expand modal
- `apps/smallstack/templatetags/crud_tags.py` — `{% crud_table %}`, `{% sortable_th %}`, `{% field_preview %}`, `{% field_transform %}`
- `apps/smallstack/templatetags/theme_tags.py` — `{% querystring %}`, `{% render_paginator %}`

## Basic table

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
        {% for user in users %}
        <tr>
          <td>
            <div class="d-flex align-items-center">
              <span class="avatar avatar-sm me-2 bg-primary-lt">{{ user.initials }}</span>
              {{ user.name }}
            </div>
          </td>
          <td class="text-secondary">{{ user.email }}</td>
          <td>
            <span class="badge bg-{{ user.status_color }}-lt">{{ user.status }}</span>
          </td>
          <td>
            <a href="{% url 'usermanager:edit' user.pk %}" class="btn btn-ghost-secondary btn-sm">Edit</a>
          </td>
        </tr>
        {% empty %}
        <tr>
          <td colspan="4" class="text-center text-secondary py-4">No users yet</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>
```

## Table classes

| Class | Effect |
|-------|--------|
| `.table` | Base styling |
| `.table-sm` | Compact rows |
| `.table-vcenter` | Vertically center cells |
| `.table-bordered` | Borders around every cell |
| `.table-borderless` | No borders |
| `.table-striped` | Alternating row backgrounds |
| `.table-hover` | Highlight on hover |
| `.table-mobile-md` | Stack rows as cards on `<md` |
| `.table-nowrap` | Prevent wrapping |
| `.card-table` | For tables inside cards — removes outer padding |
| `.table-responsive` | Wrap div: horizontal scroll on overflow |
| `.table-selectable` | Enables row-click selection styling |

### Cell utilities

- `<th class="w-1">` — minimal width column (use for action buttons)
- `<th class="text-end">` — right-align numbers
- `<td class="text-secondary">` — muted secondary text
- `<th class="sort-handle">` — sortable header indicator

## Sortable columns

### Manual sort markup

```html
<th>
  <a class="text-decoration-none text-body d-inline-flex align-items-center"
     href="{% querystring sort='name' %}">
    Name
    {% if sort == 'name' %}
      <svg class="icon icon-sm ms-1">...</svg>   <!-- up arrow -->
    {% elif sort == '-name' %}
      <svg class="icon icon-sm ms-1">...</svg>   <!-- down arrow -->
    {% endif %}
  </a>
</th>
```

### Using `{% sortable_th %}` (CRUD framework)

```django
{% load crud_tags %}
<table class="table card-table">
  <thead>
    <tr>
      {% sortable_th 'name' 'Name' %}
      {% sortable_th 'email' 'Email' %}
      {% sortable_th 'created_at' 'Created' %}
    </tr>
  </thead>
  ...
</table>
```

`{% sortable_th %}` renders a `<th>` with the link + arrow icon, toggling ascending/descending. View must handle `?sort=` and `?sort=-` query strings.

For htmx-driven sort: add `hx-get` + `hx-target` to the template tag (set `target` kwarg).

## Pagination

### Django Paginator + `{% render_paginator %}`

```python
# view
from django.core.paginator import Paginator

def list_view(request):
    qs = Item.objects.all()
    page = Paginator(qs, 25).get_page(request.GET.get('page'))
    return render(request, 'myapp/list.html', {'page_obj': page})
```

```django
{% load theme_tags %}
{% render_paginator page_obj %}
```

The template tag accepts `hx_target` and `hx_swap` kwargs for htmx-driven pagination:

```django
{% render_paginator page_obj hx_target='#table-body' hx_swap='outerHTML' %}
```

See `apps/smallstack/templates/smallstack/includes/paginator.html` for the rendered markup.

## Filters above table

```html
<div class="card">
  <div class="card-header d-flex flex-wrap gap-2">
    <h3 class="card-title">Orders</h3>
    <div class="card-actions d-flex gap-2">
      <!-- Search -->
      <div class="input-icon">
        <span class="input-icon-addon"><svg class="icon">...</svg></span>
        <input type="search" name="q" value="{{ q }}"
               class="form-control form-control-sm" placeholder="Search...">
      </div>
      <!-- Filter -->
      <select class="form-select form-select-sm" name="status">
        <option value="">All statuses</option>
        <option value="open" {% if status == 'open' %}selected{% endif %}>Open</option>
      </select>
      <!-- Date range -->
      <input type="text" class="form-control form-control-sm flatpickr-range"
             name="date_range" placeholder="Date range">
      <!-- Export -->
      <a href="?export=csv&{{ request.GET.urlencode }}" class="btn btn-outline-primary btn-sm">
        Export CSV
      </a>
    </div>
  </div>
  <div class="table-responsive">...</div>
</div>
```

Pair with `{% querystring %}` to preserve other params when filtering:

```html
<a href="{% querystring status='open' page=None %}">Open only</a>
```

(`page=None` clears the page param so the user starts at page 1 of the filtered list.)

## htmx-driven tables

### Live search

```html
<input type="search" class="form-control"
       hx-get="{% url 'orders:list_partial' %}"
       hx-trigger="keyup changed delay:300ms, search"
       hx-target="#orders-body"
       hx-include="[name=status]"
       placeholder="Search orders...">

<tbody id="orders-body">
  {% include 'orders/_rows.html' %}
</tbody>
```

The view returns just the `<tr>` rows (a partial template). Use `request.headers.get('HX-Request')` to switch between full-page and partial response — see [htmx-patterns.md](htmx-patterns.md).

### Infinite scroll

```html
<tbody>
  {% for item in items %}
  <tr>...</tr>
  {% endfor %}
  {% if page_obj.has_next %}
  <tr hx-get="{% querystring page=page_obj.next_page_number %}"
      hx-trigger="revealed"
      hx-swap="outerHTML">
    <td colspan="4" class="text-center text-secondary">Loading...</td>
  </tr>
  {% endif %}
</tbody>
```

### Inline edit

```html
<td hx-get="{% url 'item:edit_cell' item.pk 'name' %}"
    hx-trigger="dblclick"
    hx-swap="innerHTML">
  {{ item.name }}
</td>
```

Server returns an `<input>` form. On blur/submit, server saves and returns the text again.

## DataTables (full client-side enhancement)

For pages where filtering, sorting, and paginating all happen in the browser, use [DataTables.net](https://datatables.net) with the Bootstrap 5 theme:

```html
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.datatables.net/2.1.8/css/dataTables.bootstrap5.min.css">
{% endblock %}

<table id="dt-table" class="table card-table">
  <thead>
    <tr><th>Name</th><th>Email</th><th>Joined</th></tr>
  </thead>
  <tbody>
    {% for u in users %}
    <tr><td>{{ u.name }}</td><td>{{ u.email }}</td><td>{{ u.date_joined|date }}</td></tr>
    {% endfor %}
  </tbody>
</table>

{% block extra_js %}
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
<script src="https://cdn.datatables.net/2.1.8/js/dataTables.bootstrap5.min.js"></script>
<script>
new DataTable('#dt-table', {
  pageLength: 25,
  order: [[2, 'desc']],   // sort by 3rd column desc
  language: { search: '' },
});
</script>
{% endblock %}
```

**When to use DataTables vs server-side sort/paginate**:
- **DataTables**: <2000 rows, no server-side filtering needed
- **Server-side**: larger sets, or filters that hit the database (date ranges, joins, full-text search)

Don't mix — pick one or the other. DataTables ignores your server-side `?page=` so the user gets two paginators.

## List.js — client-side search + sort (lightweight)

When DataTables is overkill and you just need search-as-you-type over an existing list:

```html
<div id="user-list">
  <input class="form-control search" placeholder="Search">
  <ul class="list">
    <li>
      <span class="name">Alice</span>
      <span class="email text-secondary">alice@example.com</span>
    </li>
    <li>
      <span class="name">Bob</span>
      <span class="email text-secondary">bob@example.com</span>
    </li>
  </ul>
</div>

<script src="https://cdn.jsdelivr.net/npm/list.js@2.3.1/dist/list.min.js"></script>
<script>
new List('user-list', { valueNames: ['name', 'email'] });
</script>
```

Works for cards, tables, or any list structure.

## CRUD framework integration

SmallStack's `CRUDView` (see `apps/smallstack/crud/`) auto-generates list pages with sort, search, pagination, and field formatting. The Tabler templates for it are in `apps/tabler/templates/smallstack/crud/`.

### Use the template tag

```django
{% extends "tabler/base.html" %}
{% load crud_tags theme_tags %}

{% block content %}
<div class="card">
  <div class="card-header">
    <h3 class="card-title">{{ verbose_name_plural|title }}</h3>
    <div class="card-actions">
      <a href="{% url create_url %}" class="btn btn-primary">
        <svg class="icon">...</svg> New {{ verbose_name }}
      </a>
    </div>
  </div>
  {% crud_table %}
</div>
{% endblock %}
```

`{% crud_table %}` reads context vars (`fields`, `objects`, `sort`, etc.) provided by `CRUDView` and renders the full sortable, paginated table.

### Field transforms

```django
{# Truncate long text, click to expand in modal #}
{% field_preview detail_url obj 'description' threshold=80 %}

{# Apply named transform — e.g., markdown render, code highlight #}
{% field_transform obj 'body' 'markdown' %}
```

Register custom transforms in `apps/smallstack/crud/transforms.py`.

## Bulk actions

```html
<form method="post">
  {% csrf_token %}
  <div class="card">
    <div class="card-header d-flex justify-content-between">
      <h3 class="card-title">Items</h3>
      <select name="bulk_action" class="form-select form-select-sm w-auto">
        <option value="">Bulk action...</option>
        <option value="delete">Delete selected</option>
        <option value="archive">Archive selected</option>
      </select>
    </div>
    <table class="table card-table">
      <thead>
        <tr>
          <th class="w-1">
            <input type="checkbox" id="select-all" class="form-check-input">
          </th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {% for item in items %}
        <tr>
          <td><input type="checkbox" name="ids" value="{{ item.pk }}" class="form-check-input row-check"></td>
          <td>{{ item.name }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>
    <div class="card-footer">
      <button type="submit" class="btn btn-primary btn-sm">Apply</button>
    </div>
  </div>
</form>

<script>
document.getElementById('select-all').addEventListener('change', function() {
  document.querySelectorAll('.row-check').forEach(cb => cb.checked = this.checked);
});
</script>
```

## Row expansion / details

```html
<tr data-bs-toggle="collapse" data-bs-target="#detail-{{ obj.pk }}" class="cursor-pointer">
  <td>{{ obj.name }}</td>
  <td>{{ obj.email }}</td>
</tr>
<tr class="collapse" id="detail-{{ obj.pk }}">
  <td colspan="2" class="bg-body-tertiary">
    Full details here — possibly loaded via htmx.
  </td>
</tr>
```

## Sticky header

For long scrollable tables inside cards, add a sticky header:

```html
<div class="table-responsive" style="max-height: 600px;">
  <table class="table card-table table-vcenter">
    <thead class="position-sticky top-0 bg-body" style="z-index: 1;">
      ...
    </thead>
    <tbody>...</tbody>
  </table>
</div>
```

## CSV/JSON export

In the view:

```python
import csv
from django.http import HttpResponse

def export(request):
    qs = Item.objects.all()
    if request.GET.get('export') == 'csv':
        resp = HttpResponse(content_type='text/csv')
        resp['Content-Disposition'] = 'attachment; filename="items.csv"'
        writer = csv.writer(resp)
        writer.writerow(['Name', 'Email'])
        for item in qs:
            writer.writerow([item.name, item.email])
        return resp
    ...
```

Trigger with a button in the table card-actions:

```html
<a href="?export=csv&{{ request.GET.urlencode }}" class="btn btn-outline-primary btn-sm">
  <svg class="icon">...</svg> Export CSV
</a>
```

## Empty state inside table

```html
<tbody>
  {% for obj in objects %}
    ...
  {% empty %}
  <tr>
    <td colspan="4">
      <div class="empty">
        <div class="empty-icon"><svg class="icon icon-lg">...</svg></div>
        <p class="empty-title">No items match your filters</p>
        <p class="empty-subtitle text-secondary">
          Try adjusting your search.
        </p>
        <div class="empty-action">
          <a href="{% url 'items:create' %}" class="btn btn-primary">Add an item</a>
        </div>
      </div>
    </td>
  </tr>
  {% endfor %}
</tbody>
```

## Timezone-aware datetime cells

```django
{% load theme_tags %}
<td>{% localtime_tooltip obj.created_at %}</td>
```

`{% localtime_tooltip %}` renders the datetime in the user's timezone with a hover tooltip showing server time + UTC. See `theme_tags.py` lines 209-258.

For tables where you always want the tooltip even if timezones match (audit logs):

```django
<td>{% localtime_tooltip obj.created_at force_tooltip=True %}</td>
```

## Gotchas

- **`.table-responsive` is required** for any wide table — without it, the table will overflow `.container-xl` and break the page layout.
- **`.card-table` removes card-body padding** — useful for the table but means an in-card empty state (`<tr><td><div class="empty">...`) needs explicit `py-4` to look right.
- **htmx `hx-target` must reference an element on the current page**, not one that will be added by the swap. Target the existing tbody or wrap the table in a stable `<div id="...">`.
- **DataTables takes over the DOM** — don't try to mix htmx swaps with a DataTables-initialized table; it will desync.
- **Sortable headers with htmx need `hx-include="[name=status],[name=q]"`** to preserve filter state.
- **Bulk action checkboxes don't survive pagination** — submit before navigating, or store IDs in `localStorage` for cross-page bulk.
- **`text-end` on `<th>` doesn't propagate to `<td>`** by default — apply both, or use the `card-table-end` utility (custom in tabler_overrides.css).
- **`{% querystring page=None %}`** removes the param entirely — useful for filter changes that reset pagination.
- **Inline `<input>` in a table cell loses focus on htmx swap.** Either use `hx-swap="innerHTML"` on just the cell or preserve focus via `hx-swap-oob` for the table while keeping the input untouched.

## Related skills

- [forms.md](forms.md) — for filter forms above tables
- [htmx-patterns.md](htmx-patterns.md) — for htmx-driven sort, paginate, search, edit
- [components.md](components.md) — for buttons, badges, avatars inside cells
- [page-dashboards.md](page-dashboards.md) — for tables embedded in dashboards
- [charts.md](charts.md) — for replacing one column with a sparkline
