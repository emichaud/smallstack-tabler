# Page recipe — utility apps (kanban, todos, calendar, file manager, inbox)

**Use this skill when** building a kanban board, todo list, calendar UI, file manager, email-style inbox, or any productivity-tool-style page.

## Tabler references

- Preview: https://preview.tabler.io/email.html — email inbox layout
- Preview: https://preview.tabler.io/file-manager.html
- Preview: https://preview.tabler.io/calendar.html
- Preview: https://preview.tabler.io/cards-jobs.html — applicable to kanban tasks
- Preview: https://preview.tabler.io/tasks.html — todo / task lists

## Kanban board

```django
{% extends "tabler/base.html" %}
{% load static %}

{% block body_class %}layout-fluid{% endblock %}

{% block content %}
<div class="row row-cards flex-nowrap overflow-x-auto" style="min-height: 70vh;">
  {% for col in columns %}
  <div class="col" style="min-width: 280px; max-width: 320px;">
    <div class="card h-100">
      <div class="card-header">
        <div class="d-flex align-items-center w-100">
          <span class="status-dot bg-{{ col.color }} me-2"></span>
          <h3 class="card-title mb-0">{{ col.name }}</h3>
          <span class="badge bg-primary-lt ms-2">{{ col.cards.count }}</span>
          <div class="ms-auto">
            <button class="btn btn-icon btn-sm btn-ghost-secondary"
                    hx-get="{% url 'kanban:new_card' col.pk %}"
                    hx-target="#modal-card-body"
                    data-bs-toggle="modal" data-bs-target="#modal-card">
              <svg class="icon">...</svg>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body kanban-col"
           data-col-id="{{ col.pk }}"
           style="overflow-y: auto;">
        {% for c in col.cards.all %}
        {% include 'kanban/_card.html' %}
        {% endfor %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>

<div class="modal fade" id="modal-card">
  <div class="modal-dialog modal-lg">
    <div class="modal-content" id="modal-card-body"></div>
  </div>
</div>
{% endblock %}

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/sortablejs"></script>
<script>
document.querySelectorAll('.kanban-col').forEach(col => {
  Sortable.create(col, {
    group: 'kanban',
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function(evt) {
      const cardId = evt.item.dataset.cardId;
      const newColId = evt.to.dataset.colId;
      const newIndex = evt.newIndex;
      fetch('{% url "kanban:move" %}', {
        method: 'POST',
        headers: { 'X-CSRFToken': '{{ csrf_token }}', 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_id: cardId, col_id: newColId, index: newIndex })
      });
    }
  });
});
</script>
{% endblock %}
```

### Card partial

```django
{# kanban/_card.html #}
<div class="card mb-2 kanban-card cursor-pointer"
     data-card-id="{{ c.pk }}"
     hx-get="{% url 'kanban:detail' c.pk %}"
     hx-target="#modal-card-body"
     data-bs-toggle="modal" data-bs-target="#modal-card">
  <div class="card-body p-3">
    {% if c.priority %}
    <span class="badge bg-{{ c.priority_color }}-lt mb-2">{{ c.priority|title }}</span>
    {% endif %}
    <h4 class="card-title fs-5 mb-2">{{ c.title }}</h4>
    {% if c.due %}
    <div class="d-flex align-items-center text-secondary small mb-2">
      <svg class="icon icon-sm me-1">...</svg>
      {{ c.due|date:"M d" }}
    </div>
    {% endif %}
    {% if c.assignees.all %}
    <div class="avatar-list avatar-list-stacked mt-2">
      {% for u in c.assignees.all|slice:":3" %}
      <span class="avatar avatar-xs bg-primary-lt"
            data-bs-toggle="tooltip" title="{{ u.username }}">
        {{ u.username|slice:":2"|upper }}
      </span>
      {% endfor %}
      {% if c.assignees.count > 3 %}
      <span class="avatar avatar-xs">+{{ c.assignees.count|add:"-3" }}</span>
      {% endif %}
    </div>
    {% endif %}
  </div>
</div>
```

See [maps-calendar.md](maps-calendar.md) for the Sortable.js details and [htmx-patterns.md](htmx-patterns.md) for the modal-content load pattern.

## Todo list

```django
{% block content %}
<div class="row">
  <div class="col-lg-8 offset-lg-2">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Tasks</h3>
        <div class="card-actions">
          <select class="form-select form-select-sm w-auto" name="filter">
            <option value="all">All</option>
            <option value="open" selected>Open</option>
            <option value="done">Completed</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <form class="d-flex gap-2 mb-3"
              hx-post="{% url 'todos:create' %}"
              hx-target="#task-list"
              hx-swap="afterbegin">
          {% csrf_token %}
          <input type="text" name="title" class="form-control" placeholder="Add a task..." required>
          <button class="btn btn-primary">Add</button>
        </form>
        <ul class="list-group list-group-flush" id="task-list">
          {% for t in tasks %}
          {% include 'todos/_task.html' %}
          {% endfor %}
        </ul>
      </div>
    </div>
  </div>
</div>
{% endblock %}
```

### Task partial

```django
{# todos/_task.html #}
<li class="list-group-item d-flex align-items-center" id="task-{{ t.pk }}">
  <label class="form-check form-check-inline mb-0">
    <input class="form-check-input" type="checkbox"
           {% if t.done %}checked{% endif %}
           hx-post="{% url 'todos:toggle' t.pk %}"
           hx-target="closest li"
           hx-swap="outerHTML">
  </label>
  <span class="ms-2 {% if t.done %}text-secondary text-decoration-line-through{% endif %}">
    {{ t.title }}
  </span>
  {% if t.due %}
  <span class="badge bg-{% if t.is_overdue %}danger{% else %}blue{% endif %}-lt ms-auto me-2">
    {{ t.due|date:"M d" }}
  </span>
  {% endif %}
  <button class="btn btn-icon btn-sm btn-ghost-danger"
          hx-delete="{% url 'todos:delete' t.pk %}"
          hx-target="closest li"
          hx-swap="delete"
          hx-confirm="Delete this task?">
    <svg class="icon">...</svg>
  </button>
</li>
```

## Calendar (events) — see also `maps-calendar.md`

```django
{% extends "tabler/base.html" %}

{% block content %}
<div class="row">
  <div class="col-lg-3">
    <div class="card">
      <div class="card-body">
        <button class="btn btn-primary w-100 mb-3"
                data-bs-toggle="modal" data-bs-target="#modal-new-event">
          <svg class="icon me-1">...</svg> New event
        </button>

        <div class="subheader mb-2">Calendars</div>
        {% for cal in calendars %}
        <label class="form-check">
          <input type="checkbox" class="form-check-input" checked
                 data-cal-id="{{ cal.id }}">
          <span class="form-check-label">
            <span class="status-dot me-2" style="background: {{ cal.color }};"></span>
            {{ cal.name }}
          </span>
        </label>
        {% endfor %}
      </div>
    </div>
  </div>

  <div class="col-lg-9">
    <div class="card">
      <div class="card-body">
        <div id="calendar"></div>
      </div>
    </div>
  </div>
</div>
{% endblock %}

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.19/index.global.min.js"></script>
<script>
const cal = new FullCalendar.Calendar(document.getElementById('calendar'), {
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
  },
  events: '{% url "events:json" %}',
  eventClick: info => {
    info.jsEvent.preventDefault();
    htmx.ajax('GET', `/events/${info.event.id}/`, { target: '#offcanvas-event-body' });
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('offcanvas-event')).show();
  },
  dateClick: info => {
    document.querySelector('[name=start]').value = info.dateStr;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-new-event')).show();
  },
});
cal.render();

// Calendar filter
document.querySelectorAll('[data-cal-id]').forEach(cb => {
  cb.addEventListener('change', () => {
    const visible = [...document.querySelectorAll('[data-cal-id]:checked')].map(c => c.dataset.calId);
    cal.getEvents().forEach(ev => {
      ev.setProp('display', visible.includes(ev.extendedProps.calendarId) ? 'auto' : 'none');
    });
  });
});
</script>
{% endblock %}
```

## File manager

```django
{% extends "tabler/base.html" %}

{% block content %}
<div class="row">
  <!-- Folder tree -->
  <div class="col-md-3">
    <div class="card">
      <div class="card-body">
        <button class="btn btn-primary w-100 mb-3"
                data-bs-toggle="modal" data-bs-target="#modal-upload">
          <svg class="icon me-1">...</svg> Upload
        </button>
        <div class="subheader mb-2">Folders</div>
        <ul class="list-unstyled" id="folder-tree">
          {% include 'files/_folder_node.html' with folder=root_folder %}
        </ul>
      </div>
    </div>
  </div>

  <!-- File browser -->
  <div class="col-md-9">
    <div class="card">
      <div class="card-header">
        <ol class="breadcrumb breadcrumb-arrows mb-0">
          {% for crumb in breadcrumbs %}
          <li class="breadcrumb-item {% if forloop.last %}active{% endif %}">
            <a href="{{ crumb.url }}">{{ crumb.name }}</a>
          </li>
          {% endfor %}
        </ol>
        <div class="card-actions">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-primary active" data-view="grid">
              <svg class="icon">...</svg>
            </button>
            <button class="btn btn-outline-primary" data-view="list">
              <svg class="icon">...</svg>
            </button>
          </div>
        </div>
      </div>
      <div class="card-body" id="file-grid">
        <div class="row row-cards g-3">
          {% for f in files %}
          <div class="col-sm-6 col-md-4 col-lg-3">
            <div class="card card-sm cursor-pointer"
                 hx-get="{% url 'files:detail' f.pk %}"
                 hx-target="#offcanvas-file-body"
                 data-bs-toggle="offcanvas" data-bs-target="#offcanvas-file">
              <div class="card-body text-center">
                {% if f.is_image %}
                <img src="{{ f.thumbnail.url }}" class="img-fluid rounded mb-2" alt="">
                {% else %}
                <svg class="icon icon-xl text-secondary mb-2">...</svg>
                {% endif %}
                <div class="text-truncate small fw-medium">{{ f.name }}</div>
                <div class="text-secondary tiny">{{ f.size|filesizeformat }}</div>
              </div>
            </div>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</div>

<!-- File detail offcanvas -->
<div class="offcanvas offcanvas-end" id="offcanvas-file">
  <div class="offcanvas-header">
    <h2 class="offcanvas-title">File details</h2>
    <button class="btn-close" data-bs-dismiss="offcanvas"></button>
  </div>
  <div class="offcanvas-body" id="offcanvas-file-body"></div>
</div>

<!-- Upload modal with Dropzone -->
<div class="modal" id="modal-upload">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Upload files</h5>
        <button class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form action="{% url 'files:upload' %}" class="dropzone" id="upload-dz">
          {% csrf_token %}
        </form>
      </div>
    </div>
  </div>
</div>
{% endblock %}
```

Dropzone init: see [forms.md](forms.md).

### List view (alternative)

```html
<table class="table card-table table-vcenter">
  <thead>
    <tr>
      <th>Name</th>
      <th>Size</th>
      <th>Modified</th>
      <th class="w-1"></th>
    </tr>
  </thead>
  <tbody>
    {% for f in files %}
    <tr>
      <td>
        <div class="d-flex align-items-center">
          {% if f.is_image %}
          <img src="{{ f.thumbnail.url }}" class="me-2" width="32" height="32">
          {% else %}
          <svg class="icon me-2 text-secondary">...</svg>
          {% endif %}
          {{ f.name }}
        </div>
      </td>
      <td class="text-secondary">{{ f.size|filesizeformat }}</td>
      <td class="text-secondary">{{ f.updated_at|date:"M d, Y" }}</td>
      <td>
        <button class="btn btn-icon btn-sm btn-ghost-secondary">
          <svg class="icon">...</svg>
        </button>
      </td>
    </tr>
    {% endfor %}
  </tbody>
</table>
```

## Email-style inbox

```django
{% extends "tabler/base.html" %}

{% block body_class %}layout-fluid{% endblock %}

{% block content %}
<div class="row g-0">
  <!-- Folder/label sidebar -->
  <div class="col-md-2 border-end">
    <div class="p-3">
      <button class="btn btn-primary w-100 mb-3"
              data-bs-toggle="modal" data-bs-target="#modal-compose">
        <svg class="icon me-1">...</svg> Compose
      </button>
      <ul class="list-unstyled">
        <li><a class="d-block py-2 px-2 rounded bg-primary-lt text-primary">Inbox <span class="float-end">12</span></a></li>
        <li><a class="d-block py-2 px-2 rounded">Starred</a></li>
        <li><a class="d-block py-2 px-2 rounded">Sent</a></li>
        <li><a class="d-block py-2 px-2 rounded">Drafts</a></li>
        <li><a class="d-block py-2 px-2 rounded">Trash</a></li>
      </ul>
      <div class="subheader mt-3 mb-2">Labels</div>
      <ul class="list-unstyled">
        {% for label in labels %}
        <li><a class="d-block py-1 px-2"><span class="status-dot me-2" style="background: {{ label.color }};"></span> {{ label.name }}</a></li>
        {% endfor %}
      </ul>
    </div>
  </div>

  <!-- Message list -->
  <div class="col-md-4 border-end">
    <div class="p-2">
      <input type="search" class="form-control form-control-sm" placeholder="Search mail...">
    </div>
    <div class="list-group list-group-flush" style="height: calc(100vh - 130px); overflow-y: auto;">
      {% for msg in messages %}
      <a href="{% url 'mail:detail' msg.pk %}"
         class="list-group-item list-group-item-action {% if msg == current_msg %}active{% endif %}"
         hx-get="{% url 'mail:detail_partial' msg.pk %}"
         hx-target="#message-detail"
         hx-push-url="true">
        <div class="d-flex">
          <strong>{{ msg.from_name }}</strong>
          <small class="ms-auto text-secondary">{{ msg.received|date:"M d" }}</small>
        </div>
        <div class="fw-medium">{{ msg.subject }}</div>
        <div class="text-secondary small text-truncate">{{ msg.preview }}</div>
        {% if msg.labels.all %}
        <div class="mt-1">
          {% for l in msg.labels.all %}
          <span class="badge bg-{{ l.color }}-lt">{{ l.name }}</span>
          {% endfor %}
        </div>
        {% endif %}
      </a>
      {% endfor %}
    </div>
  </div>

  <!-- Message detail -->
  <div class="col-md-6" id="message-detail">
    {% include 'mail/_detail.html' %}
  </div>
</div>
{% endblock %}
```

## Activity feed

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Activity</h3>
  </div>
  <div class="card-body">
    <ul class="timeline">
      {% for ev in activity %}
      <li class="timeline-event">
        <div class="timeline-event-icon bg-{{ ev.color }}-lt">
          <svg class="icon">...</svg>
        </div>
        <div class="card timeline-event-card">
          <div class="card-body">
            <div class="text-secondary float-end">{{ ev.created|timesince }}</div>
            <h4 class="mb-1">{{ ev.title }}</h4>
            <p class="text-secondary mb-0">{{ ev.description }}</p>
          </div>
        </div>
      </li>
      {% endfor %}
    </ul>
  </div>
</div>
```

## Notifications dropdown / center

```html
<!-- Trigger button in navbar -->
<div class="nav-item dropdown">
  <a class="nav-link px-2" data-bs-toggle="dropdown">
    <svg class="icon">...</svg>
    <span class="badge bg-red badge-notification">3</span>
  </a>
  <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow" style="width: 340px;">
    <div class="dropdown-header d-flex justify-content-between">
      <span>Notifications</span>
      <a href="#" class="small">Mark all as read</a>
    </div>
    {% for n in notifications %}
    <a href="{{ n.url }}" class="dropdown-item d-flex align-items-start gap-2">
      <span class="avatar avatar-sm bg-{{ n.color }}-lt">
        <svg class="icon icon-sm">...</svg>
      </span>
      <div>
        <div>{{ n.title }}</div>
        <div class="text-secondary small">{{ n.created|timesince }} ago</div>
      </div>
    </a>
    {% endfor %}
    <div class="dropdown-divider"></div>
    <a href="{% url 'notifications:all' %}" class="dropdown-item text-center">View all</a>
  </div>
</div>
```

## Profile / settings page

```django
{% extends "tabler/base.html" %}

{% block content %}
<div class="row g-4">
  <!-- Side nav -->
  <aside class="col-md-3">
    <div class="list-group">
      <a href="#general" class="list-group-item list-group-item-action active">General</a>
      <a href="#security" class="list-group-item list-group-item-action">Security</a>
      <a href="#notifications" class="list-group-item list-group-item-action">Notifications</a>
      <a href="#billing" class="list-group-item list-group-item-action">Billing</a>
      <a href="#api" class="list-group-item list-group-item-action">API tokens</a>
      <a href="#danger" class="list-group-item list-group-item-action text-danger">Danger zone</a>
    </div>
  </aside>

  <!-- Sections -->
  <div class="col-md-9">
    <section id="general" class="card mb-3">
      <div class="card-header"><h3 class="card-title">General</h3></div>
      <div class="card-body">{# form #}</div>
    </section>

    <section id="security" class="card mb-3">
      <div class="card-header"><h3 class="card-title">Security</h3></div>
      <div class="card-body">{# 2FA, password change #}</div>
    </section>

    <section id="danger" class="card border-danger">
      <div class="card-header bg-danger-lt"><h3 class="card-title text-danger">Danger zone</h3></div>
      <div class="card-body">
        <h4>Delete account</h4>
        <p class="text-secondary">This permanently deletes your account and all data.</p>
        <button class="btn btn-danger">Delete my account</button>
      </div>
    </section>
  </div>
</div>
{% endblock %}
```

## Gotchas

- **`layout-fluid` for kanban/inbox** — edge-to-edge real estate matters when you have 4+ columns. See [layouts.md](layouts.md).
- **Sortable.js with htmx**: after an htmx swap that replaces a sortable container, the Sortable instance is gone. Re-init on `htmx:afterSwap`.
- **Inbox sidebar height** must be `calc(100vh - <navbar height>)` to scroll properly. Adjust the constant.
- **Kanban column overflow on mobile** is best handled by `overflow-x-auto` on the row + fixed min-width per column.
- **Notification badge in navbar** needs `position: relative` on the parent for `badge-notification` to position correctly — Tabler does this for `.nav-link`.
- **Email-style three-column layout breaks below `md`** — design a stacked mobile view (list → detail → back).
- **Calendar inside a card** can have height issues. Use `height: 'auto'` or set a fixed pixel height.
- **File uploads via Dropzone** need CSRF headers in the Dropzone config — see [forms.md](forms.md).

## Related skills

- [components.md](components.md) — for cards, lists, badges, status used across these
- [maps-calendar.md](maps-calendar.md) — for Sortable.js + FullCalendar setup
- [forms.md](forms.md) — for upload, search, todo-create forms
- [htmx-patterns.md](htmx-patterns.md) — for the dynamic loading patterns these rely on
- [layouts.md](layouts.md) — for choosing fluid vs default
- [tables.md](tables.md) — for the file-manager list view
