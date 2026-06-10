# Maps & Calendar — jsvectormap, FullCalendar, Sortable.js

**Use this skill when** adding a geographic map (world/country/region), a full event calendar, or drag-drop sortable lists/kanban.

## Tabler references

- Docs: https://docs.tabler.io/ui/components/maps
- Docs: https://docs.tabler.io/ui/components/calendar
- Preview: https://preview.tabler.io/maps-vector.html
- Preview: https://preview.tabler.io/calendar.html
- jsVectorMap: https://jvm-docs.vercel.app/
- FullCalendar: https://fullcalendar.io/docs
- Sortable.js: https://sortablejs.github.io/Sortable/

## jsVectorMap — world / regional maps

```html
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jsvectormap/dist/jsvectormap.min.css">
{% endblock %}

<div class="card">
  <div class="card-body">
    <h3 class="card-title">Users by country</h3>
    <div id="map-world" style="height: 360px;"></div>
  </div>
</div>

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/jsvectormap/dist/jsvectormap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/jsvectormap/dist/maps/world.js"></script>
<script>
const styles = getComputedStyle(document.documentElement);
new jsVectorMap({
  selector: '#map-world',
  map: 'world',
  backgroundColor: 'transparent',
  regionStyle: {
    initial: { fill: styles.getPropertyValue('--tblr-gray-300').trim() },
    hover:   { fill: styles.getPropertyValue('--tblr-primary').trim() },
  },
  series: {
    regions: [{
      values: { US: 1240, CA: 580, GB: 420, DE: 310 },
      scale: ['#cfe2ff', styles.getPropertyValue('--tblr-primary').trim()],
      normalizeFunction: 'polynomial',
    }],
  },
  onRegionTooltipShow: (e, tooltip, code) => {
    const v = tooltip.props.text();
    tooltip.text(`${tooltip.props.text()}: ${v || 0} users`);
  },
});
</script>
{% endblock %}
```

### Available maps

jsVectorMap ships with: `world`, `world-merc`, `us-merc`, `us-aea`, `canada`, `brazil`, `russia`, `spain`, plus many country-level maps. Each is a separate JS file — load only the ones you need.

```html
<!-- For US states -->
<script src="https://cdn.jsdelivr.net/npm/jsvectormap/dist/maps/us-aea.js"></script>
<script>
new jsVectorMap({ selector: '#map', map: 'us_aea' });
</script>
```

### Markers (points on map)

```js
new jsVectorMap({
  selector: '#map',
  map: 'world',
  markers: [
    { name: 'New York', coords: [40.7128, -74.0060] },
    { name: 'London',   coords: [51.5074, -0.1278] },
    { name: 'Tokyo',    coords: [35.6762, 139.6503] },
  ],
  markerStyle: {
    initial: { fill: styles.getPropertyValue('--tblr-primary').trim(), r: 5 },
  },
});
```

### Click handler (drill-down)

```js
new jsVectorMap({
  selector: '#map',
  map: 'world',
  onRegionClick: (e, code) => {
    window.location.href = `/users/?country=${code}`;
  },
});
```

### Dark mode

Layer in CSS:
```css
body.theme-dark #map-world .jvm-region { fill: var(--tblr-gray-600); }
body.theme-dark #map-world .jvm-region:hover { fill: var(--tblr-primary); }
```

Or pass `regionStyle.initial.fill` based on `document.body.classList.contains('theme-dark')` at init.

## FullCalendar — event-driven calendar

```html
{% block extra_css %}
<style>
  #calendar { min-height: 600px; }
  /* Dark-mode polish */
  body.theme-dark .fc-toolbar-title,
  body.theme-dark .fc-col-header-cell-cushion,
  body.theme-dark .fc-daygrid-day-number { color: var(--tblr-body-color); }
  body.theme-dark .fc-day-today { background: rgba(245,159,0,0.08) !important; }
  body.theme-dark .fc-scrollgrid, body.theme-dark .fc-scrollgrid-section td {
    border-color: var(--tblr-border-color);
  }
</style>
{% endblock %}

<div class="card">
  <div class="card-body">
    <div id="calendar"></div>
  </div>
</div>

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
  height: 'auto',
  events: '{% url "events:json" %}',           // JSON endpoint
  eventClick: function(info) {
    info.jsEvent.preventDefault();
    // Open offcanvas or modal with details
    htmx.ajax('GET', `/events/${info.event.id}/`, { target: '#offcanvas-event-body' });
    bootstrap.Offcanvas.getOrCreateInstance(document.getElementById('offcanvas-event')).show();
  },
  dateClick: function(info) {
    // Open create-event modal pre-filled with the clicked date
  },
  editable: true,
  eventDrop: function(info) {
    fetch(`/events/${info.event.id}/move/`, {
      method: 'POST',
      headers: { 'X-CSRFToken': '{{ csrf_token }}', 'Content-Type': 'application/json' },
      body: JSON.stringify({ start: info.event.start.toISOString() })
    });
  },
});
cal.render();
</script>
{% endblock %}
```

### Event endpoint format

```python
from django.http import JsonResponse

def events_json(request):
    qs = Event.objects.filter(
        start__gte=request.GET['start'],
        start__lte=request.GET['end'],
    )
    return JsonResponse([
        {
            'id': e.pk,
            'title': e.title,
            'start': e.start.isoformat(),
            'end': e.end.isoformat() if e.end else None,
            'color': e.calendar.color,
            'url': f"/events/{e.pk}/",
        }
        for e in qs
    ], safe=False)
```

### Views

| View | Class |
|------|-------|
| Month | `dayGridMonth` |
| Week | `timeGridWeek` |
| Day | `timeGridDay` |
| List week | `listWeek` |
| Year | `multiMonthYear` (loads `multiMonth` plugin) |

### Color-coded events

```js
events: [
  { title: 'Meeting', start: '2026-06-12T10:00:00', backgroundColor: '#206bc4', borderColor: '#206bc4' },
  { title: 'PTO',      start: '2026-06-15', allDay: true, backgroundColor: '#2fb344' },
]
```

### Recurring events

```js
events: [
  {
    title: 'Standup',
    startTime: '09:00',
    daysOfWeek: [1, 2, 3, 4, 5],  // Mon-Fri
  }
]
```

### Drag-from-outside

```html
<div id="external-events" class="card">
  <div class="card-body">
    <div class="fc-event" data-event='{"title":"New booking"}'>📅 New booking</div>
    <div class="fc-event" data-event='{"title":"Day off"}'>🌴 Day off</div>
  </div>
</div>

<script>
const draggable = new FullCalendar.Draggable(document.getElementById('external-events'), {
  itemSelector: '.fc-event',
  eventData: function(el) {
    return JSON.parse(el.dataset.event);
  }
});
// FullCalendar with `droppable: true`, listener `eventReceive`
</script>
```

### SmallStack's CalendarDisplay alternative

If you just need a month grid for a single Django model with a `date_field`, SmallStack ships a simpler [`CalendarDisplay`](../calendar-displays.md) — see `apps/smallstack/crud/displays/calendar.py`. Use FullCalendar when you need:
- Multiple views (week/day)
- Drag-drop event editing
- Cross-model event aggregation
- External-drag, recurring, time-aware events

Use `CalendarDisplay` when you need:
- A simple "show records on a month grid"
- No write/drag interaction
- Tight integration with CRUDView

## Sortable.js — drag-drop lists & kanban

### Single sortable list

```html
<ul id="sortable-list" class="list-group">
  <li class="list-group-item" data-id="1">Item 1</li>
  <li class="list-group-item" data-id="2">Item 2</li>
  <li class="list-group-item" data-id="3">Item 3</li>
</ul>

<script src="https://cdn.jsdelivr.net/npm/sortablejs"></script>
<script>
Sortable.create(document.getElementById('sortable-list'), {
  animation: 150,
  ghostClass: 'sortable-ghost',
  onEnd: function(evt) {
    const order = [...evt.to.children].map(li => li.dataset.id);
    fetch('{% url "items:reorder" %}', {
      method: 'POST',
      headers: { 'X-CSRFToken': '{{ csrf_token }}', 'Content-Type': 'application/json' },
      body: JSON.stringify({ order })
    });
  }
});
</script>
```

### Kanban board (multiple columns)

```html
<div class="row row-cards">
  {% for column in columns %}
  <div class="col-md-4">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ column.name }}</h3>
        <span class="badge bg-blue-lt ms-2">{{ column.cards.count }}</span>
      </div>
      <div class="card-body kanban-col" data-col-id="{{ column.id }}">
        {% for card in column.cards.all %}
        <div class="card mb-2 kanban-card" data-id="{{ card.id }}">
          <div class="card-body py-2">
            <strong>{{ card.title }}</strong>
            <div class="text-secondary small">{{ card.due|date:"M d" }}</div>
          </div>
        </div>
        {% endfor %}
      </div>
    </div>
  </div>
  {% endfor %}
</div>

<script src="https://cdn.jsdelivr.net/npm/sortablejs"></script>
<script>
document.querySelectorAll('.kanban-col').forEach(col => {
  Sortable.create(col, {
    group: 'kanban',              // ← same group → drag across columns
    animation: 150,
    ghostClass: 'sortable-ghost',
    onEnd: function(evt) {
      const cardId = evt.item.dataset.id;
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
```

### Ghost / drag styles

```css
.sortable-ghost { opacity: 0.4; background: var(--tblr-primary-lt); }
.sortable-chosen { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.sortable-drag   { transform: rotate(2deg); }
```

### Handle (drag only by a specific element)

```html
<div class="card kanban-card">
  <div class="card-body">
    <span class="drag-handle cursor-move me-2">⋮⋮</span>
    {{ card.title }}
  </div>
</div>

<script>
Sortable.create(col, { handle: '.drag-handle' });
</script>
```

## Combining: kanban with FullCalendar drop-target

External drag from a Sortable into FullCalendar:

```js
Sortable.create(document.getElementById('backlog'), {
  group: { name: 'tasks', pull: 'clone', put: false },
  sort: false
});

const cal = new FullCalendar.Calendar(el, {
  droppable: true,
  drop: function(info) {
    const title = info.draggedEl.querySelector('.title').textContent;
    cal.addEvent({ title, start: info.date, allDay: info.allDay });
    fetch('/tasks/schedule/', {
      method: 'POST',
      body: JSON.stringify({ task_id: info.draggedEl.dataset.id, date: info.dateStr })
    });
  }
});
```

## Maps gotchas

- **`map: 'world'` requires the world JS file to be loaded first** — order matters: `jsvectormap.min.js` before `world.js`.
- **Region codes are ISO 3166-1 alpha-2 uppercased** (`US`, `GB`, `DE`) — not lowercase or 3-letter.
- **`backgroundColor: 'transparent'`** lets the card background show through; otherwise the map paints white over your dark mode.
- **Series scale array must have 2 values** for linear or 3+ for stepped — color interpolation between them.
- **The map doesn't auto-resize.** On window resize, call `map.updateSize()` or wrap in a ResizeObserver.

## Calendar gotchas

- **The global build (`index.global.min.js`) includes all plugins** — for production, bundle only what you need to save ~150KB.
- **CSRF token is needed for any `eventDrop`/`eventReceive` write** — pass `'X-CSRFToken'` header.
- **Time zones**: FullCalendar uses the browser's local timezone by default. For server-defined timezones, pass `timeZone: 'America/New_York'` and ensure event ISO strings are timezone-aware.
- **`height: 'auto'` grows the calendar to fit content** — for inside-card, set explicit `height: 600` or use `aspectRatio`.
- **Events endpoint receives `?start=` and `?end=`** — filter your queryset by these to scale.
- **Re-render after theme change**: FullCalendar reads colors once. Call `cal.render()` or update event color individually.

## Sortable.js gotchas

- **`group: 'name'` is required for cross-list drags** — different groups can't share items.
- **`onEnd` fires on every drop**, including same-position no-op moves. Compare `evt.oldIndex` and `evt.newIndex` to filter.
- **Server reorder calls are racy** — multiple drags before save complete can desync. Debounce, or send a full ordering snapshot, not individual moves.
- **Touch devices**: Sortable supports touch out of the box but you may want `delay: 100, delayOnTouchOnly: true` to avoid accidental drags while scrolling.
- **Don't combine Sortable with htmx that swaps the sortable container** — Sortable's bindings are lost after swap. Re-init on `htmx:afterSwap`.

## Related skills

- [page-utility.md](page-utility.md) — kanban / calendar / file-manager utility pages combining these
- [page-dashboards.md](page-dashboards.md) — for putting maps in dashboard cards
- [calendar-displays.md](../calendar-displays.md) (parent dir) — for SmallStack's built-in calendar list-display alternative
- [htmx-patterns.md](htmx-patterns.md) — for re-init after swap
- [components.md](components.md) — for the cards housing these widgets
