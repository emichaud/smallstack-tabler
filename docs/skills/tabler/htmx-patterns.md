# HTMX + Tabler — patterns for dynamic interactions

**Use this skill when** wiring htmx into Tabler components: tabs that lazy-load, table refresh, infinite scroll, offcanvas/modal content, toast notifications from server responses, re-initializing Bootstrap JS after swap.

This file covers Tabler-specific htmx patterns. For SmallStack's general htmx setup (CSRF, partials, dual-response views), see [../htmx-patterns.md](../htmx-patterns.md).

## What's already configured

`apps/tabler/templates/tabler/base.html`:

```html
<body class="..." hx-headers='{"X-CSRFToken": "{{ csrf_token }}"}'>
```

The CSRF token is automatically attached to every htmx request — no per-request setup needed.

htmx is loaded from `{% static 'smallstack/js/htmx.min.js' %}` (vendored, **not** CDN) with `defer` — runs after the DOM is parsed.

## Tabler's "JS auto-init" rule

Tabler (and Bootstrap 5) initialize components automatically from `data-bs-toggle` attributes when the page loads. After an htmx swap, **new nodes are not auto-initialized**. This is the most common Tabler-htmx gotcha.

### The fix: re-init on swap

Add this once to your base template's `extra_js` (or to `tabler_overrides.js`):

```js
document.body.addEventListener('htmx:afterSwap', function(evt) {
  const root = evt.target;

  // Re-init tooltips
  root.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
    if (!bootstrap.Tooltip.getInstance(el)) new bootstrap.Tooltip(el);
  });

  // Re-init popovers
  root.querySelectorAll('[data-bs-toggle="popover"]').forEach(el => {
    if (!bootstrap.Popover.getInstance(el)) new bootstrap.Popover(el);
  });

  // Re-init dropdowns
  root.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
    if (!bootstrap.Dropdown.getInstance(el)) new bootstrap.Dropdown(el);
  });

  // ClipboardJS — re-bind to new buttons
  root.querySelectorAll('[data-clipboard-target]').forEach(el => {
    if (!el.dataset.clipboardInitialized) {
      new ClipboardJS(el);
      el.dataset.clipboardInitialized = 'true';
    }
  });
});
```

Tabs, modals, offcanvas, accordions, and toasts have idempotent `data-bs-toggle` handling — they work fine after swap. Only tooltips, popovers, and dropdowns truly need manual re-init.

## Tabs that lazy-load

```html
<ul class="nav nav-tabs">
  <li class="nav-item">
    <a class="nav-link active" data-bs-toggle="tab" href="#tab-overview">Overview</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" data-bs-toggle="tab" href="#tab-activity"
       hx-get="{% url 'app:activity_partial' %}"
       hx-target="#tab-activity"
       hx-trigger="click once">Activity</a>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane active" id="tab-overview">Static</div>
  <div class="tab-pane" id="tab-activity">
    <div class="text-center py-4 text-secondary">Click to load activity...</div>
  </div>
</div>
```

`hx-trigger="click once"` fires the load exactly once per page lifetime — switching back to the tab won't re-fetch.

For "always refresh on tab click":

```html
hx-trigger="click"
```

## Modal content via htmx

```html
<a class="btn btn-primary"
   hx-get="{% url 'orders:edit' order.pk %}"
   hx-target="#modal-edit .modal-body"
   data-bs-toggle="modal" data-bs-target="#modal-edit">
  Edit
</a>

<div class="modal fade" id="modal-edit" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Edit Order</h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
    </div>
  </div>
</div>
```

When the link is clicked:
1. Modal opens (via Bootstrap's data-bs-toggle)
2. htmx fetches the partial and swaps into `.modal-body`

The view returns just the body content (form, table, etc.) — no `<html>` wrapper.

### Closing the modal from the server

Server sends `HX-Trigger: closeModal` header, client listens:

```js
document.body.addEventListener('closeModal', () => {
  bootstrap.Modal.getInstance(document.getElementById('modal-edit')).hide();
});
```

```python
from django.http import HttpResponse

def save_order(request, pk):
    form = OrderForm(request.POST, instance=Order.objects.get(pk=pk))
    if form.is_valid():
        form.save()
        resp = HttpResponse(status=204)
        resp['HX-Trigger'] = 'closeModal, refreshTable'
        return resp
    return render(request, 'orders/_form.html', {'form': form})  # form with errors
```

Multiple events comma-separated. The client triggers each on `document.body`.

## Offcanvas with htmx

```html
<a class="btn btn-outline-primary"
   hx-get="{% url 'users:details' user.pk %}"
   hx-target="#offcanvas-user-body"
   data-bs-toggle="offcanvas" data-bs-target="#offcanvas-user">
  View
</a>

<div class="offcanvas offcanvas-end" id="offcanvas-user">
  <div class="offcanvas-header">
    <h2 class="offcanvas-title">User Details</h2>
    <button class="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>
  <div class="offcanvas-body" id="offcanvas-user-body">
    <div class="text-center py-5"><div class="spinner-border"></div></div>
  </div>
</div>
```

## Table refresh

### Live search

```html
<input type="search" class="form-control"
       hx-get="{% url 'orders:list_partial' %}"
       hx-trigger="keyup changed delay:300ms, search"
       hx-target="#orders-tbody"
       hx-swap="innerHTML"
       hx-include="[name=status],[name=date_range]"
       placeholder="Search orders...">
```

`hx-include` is critical — without it, the request won't include the other filters.

### Sort via header link

```html
<th>
  <a hx-get="{% querystring sort='name' %}"
     hx-target="#orders-tbody"
     hx-swap="innerHTML"
     hx-push-url="true">Name</a>
</th>
```

`hx-push-url="true"` updates the browser URL so refresh / back work correctly.

### Pagination

```html
{% load theme_tags %}
{% render_paginator page_obj hx_target='#orders-tbody' hx_swap='innerHTML swap:150ms' %}
```

See `apps/smallstack/templatetags/theme_tags.py` `render_paginator`.

## Infinite scroll

```html
<tbody id="items-tbody">
  {% include 'items/_rows.html' %}
  {% if page_obj.has_next %}
  <tr id="load-more"
      hx-get="{% querystring page=page_obj.next_page_number %}"
      hx-trigger="revealed"
      hx-swap="outerHTML">
    <td colspan="4" class="text-center text-secondary py-3">
      <div class="spinner-border spinner-border-sm"></div> Loading more...
    </td>
  </tr>
  {% endif %}
</tbody>
```

The view returns more rows + the next sentinel row (or no sentinel if at the end).

```django
{# items/_rows_with_sentinel.html #}
{% for item in items %}
<tr>...</tr>
{% endfor %}
{% if page_obj.has_next %}
<tr id="load-more"
    hx-get="{% querystring page=page_obj.next_page_number %}"
    hx-trigger="revealed"
    hx-swap="outerHTML">
  <td colspan="4">Loading...</td>
</tr>
{% endif %}
```

## Toast notifications from server response

Add a fixed-position toast container to `base.html`:

```html
<div id="toast-container" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1080;"></div>
```

Server sends `HX-Trigger`:

```python
import json

def save(request):
    Form(request.POST).save()
    resp = HttpResponse(status=204)
    resp['HX-Trigger'] = json.dumps({
        'showToast': { 'message': 'Saved successfully', 'level': 'success' }
    })
    return resp
```

Client handler:

```js
document.body.addEventListener('showToast', function(evt) {
  const { message, level } = evt.detail;
  const toastEl = document.createElement('div');
  toastEl.className = 'toast align-items-center text-bg-' + (level || 'primary');
  toastEl.role = 'alert';
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;
  document.getElementById('toast-container').appendChild(toastEl);
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();
  toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
});
```

## Form submission

### Replace the form with the result

```html
<form hx-post="{% url 'orders:create' %}"
      hx-target="this"
      hx-swap="outerHTML">
  {% csrf_token %}
  {% include 'orders/_form_body.html' %}
  <button class="btn btn-primary">Save</button>
</form>
```

The view returns either the same form with errors, or a success card.

### Add loading state to submit button

```html
<button class="btn btn-primary"
        hx-disabled-elt="this">
  <span class="htmx-indicator spinner-border spinner-border-sm me-2"></span>
  Save
</button>
```

`hx-disabled-elt="this"` disables the button while the request is in flight. The `.htmx-indicator` element is hidden by default, shown during requests.

CSS (already in Tabler):
```css
.htmx-request .htmx-indicator,
.htmx-request.htmx-indicator { opacity: 1; visibility: visible; }
.htmx-indicator { opacity: 0; transition: opacity 200ms; }
```

## Inline edit (table cell)

```html
<td>
  <span class="editable cursor-pointer"
        hx-get="{% url 'items:edit_field' item.pk 'name' %}"
        hx-target="this"
        hx-swap="outerHTML"
        hx-trigger="dblclick">{{ item.name }}</span>
</td>
```

Server returns:

```django
<td>
  <input type="text" class="form-control form-control-sm" value="{{ item.name }}"
         hx-post="{% url 'items:save_field' item.pk 'name' %}"
         hx-target="closest td"
         hx-swap="outerHTML"
         hx-trigger="blur"
         autofocus>
</td>
```

## OOB (out-of-band) swap — update multiple parts

Update the row AND the total counter from a single response:

```python
def add_item(request):
    item = Item.objects.create(...)
    return render(request, 'items/_added.html', { 'item': item, 'count': Item.objects.count() })
```

```django
{# _added.html #}
<tr id="row-{{ item.pk }}">...</tr>
<span id="item-count" hx-swap-oob="true">{{ count }} items</span>
```

The `hx-swap-oob="true"` element finds and replaces the matching `#item-count` elsewhere on the page.

## hx-push-url for SPA-like navigation

```html
<a hx-get="{% url 'dashboard:detail' dashboard.pk %}"
   hx-target="#main-content"
   hx-push-url="true">{{ dashboard.name }}</a>
```

Updates the URL bar and adds to history — back/forward work. Pair with a view that handles both htmx and non-htmx requests (dual-response).

## htmx events for chart updates

```html
<div hx-get="{% url 'charts:rpm' %}"
     hx-trigger="every 10s"
     hx-swap="none"
     hx-on::after-request="updateChart(JSON.parse(event.detail.xhr.responseText))"></div>
```

`hx-swap="none"` — don't swap any DOM. The `hx-on::after-request` attribute runs JS with the response. See [charts.md](charts.md) for chart-update patterns.

## Polling

```html
<div hx-get="{% url 'jobs:status' job.pk %}"
     hx-trigger="every 2s"
     hx-target="this"
     hx-swap="outerHTML">
  {% include 'jobs/_status.html' %}
</div>
```

When the job is done, the server returns markup *without* the `hx-trigger` attribute so polling stops.

## Loading indicator (global)

```html
<div id="loading-bar" class="htmx-indicator position-fixed top-0 start-0 end-0"
     style="height: 3px; background: var(--tblr-primary); z-index: 9999;"></div>
```

Shows whenever any htmx request is in flight (the body gets `.htmx-request` while loading).

For a per-request indicator, use `hx-indicator="#spinner-id"` on the triggering element.

## `htmx:beforeSwap` to customize behavior

```js
document.body.addEventListener('htmx:beforeSwap', function(evt) {
  if (evt.detail.xhr.status === 422) {
    // Validation error response — still swap
    evt.detail.shouldSwap = true;
    evt.detail.isError = false;
  }
});
```

## `htmx:responseError` for global error handling

```js
document.body.addEventListener('htmx:responseError', function(evt) {
  // Trigger the showToast event with an error
  document.body.dispatchEvent(new CustomEvent('showToast', {
    detail: { message: 'Server error', level: 'danger' }
  }));
});
```

## Confirm before destructive actions

```html
<button class="btn btn-danger"
        hx-delete="{% url 'orders:delete' order.pk %}"
        hx-confirm="Delete this order? This cannot be undone."
        hx-target="#order-{{ order.pk }}"
        hx-swap="delete">Delete</button>
```

`hx-confirm` triggers a native `confirm()`. For a Tabler-styled modal instead, listen for `htmx:confirm`:

```js
document.body.addEventListener('htmx:confirm', function(evt) {
  if (evt.detail.question) {
    evt.preventDefault();
    showTablerConfirm(evt.detail.question).then(ok => {
      if (ok) evt.detail.issueRequest();
    });
  }
});
```

Where `showTablerConfirm` opens a danger-styled modal — see [components.md](components.md) for the danger modal markup.

## SmallStack's dual-response pattern

Views that handle both full-page and htmx-partial responses:

```python
def list_view(request):
    qs = filter_queryset(request)
    if request.headers.get('HX-Request'):
        return render(request, 'orders/_rows.html', { 'orders': qs })
    return render(request, 'orders/list.html', { 'orders': qs })
```

See [../htmx-patterns.md](../htmx-patterns.md) for the full SmallStack pattern.

## Gotchas

- **Tabler JS auto-init runs once.** Add the global re-init handler shown at the top of this file, or you'll find dropdowns inside swapped content unresponsive.
- **Modals + htmx + form submission**: don't submit a form *inside* a modal with `hx-target="this"`. The modal closes when the swap replaces the form, losing context. Target a div *outside* the modal, OR use the close-from-server pattern with `HX-Trigger: closeModal`.
- **`hx-push-url="true"` requires the server to return a full page for direct URL access** — implement the dual-response pattern.
- **`hx-include` uses CSS selectors, not form field references.** Pass `[name=foo]` not `foo`.
- **`hx-target="closest .card"` is your friend** — relative selectors save you from threading IDs through templates.
- **Idle htmx polling continues even on inactive tabs.** Use `hx-trigger="every 10s[document.visibilityState === 'visible']"` to skip when hidden.
- **`hx-swap` defaults to `innerHTML`** — for `<tr>` swaps, you need `outerHTML` or the row gets nested.
- **Don't htmx-swap the navbar** — the settings offcanvas, apps grid, and user dropdown lose their event handlers. Swap into `<main>` content only.
- **`htmx:afterSwap` fires once per swap.** If you `hx-swap-oob` multiple elements, the handler runs once on the primary target — but OOB nodes are not visited by your re-init traversal. Walk the document on `htmx:afterSettle` for OOB-heavy responses.

## Related skills

- [components.md](components.md) — for components used in swapped content
- [forms.md](forms.md) — for form-submission patterns
- [tables.md](tables.md) — for table refresh and inline-edit
- [charts.md](charts.md) — for live chart updates
- [troubleshooting.md](troubleshooting.md) — debugging Tabler JS init issues after swap
- [../htmx-patterns.md](../htmx-patterns.md) — SmallStack's general htmx setup
