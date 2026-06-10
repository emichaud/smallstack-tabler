# Page recipe — admin dashboards

**Use this skill when** building an internal/admin dashboard: stat rows, KPI cards, analytics charts, recent-activity tables, real-time monitoring.

## Tabler references

- Preview: https://preview.tabler.io/index.html — flagship dashboard
- Preview: https://preview.tabler.io/dashboard-analytics.html — analytics-focused
- Preview: https://preview.tabler.io/dashboard-fleet.html — operations / fleet
- Preview: https://preview.tabler.io/dashboard-crm.html — CRM
- Preview: https://preview.tabler.io/dashboard-ecommerce.html — ecommerce

## In-repo examples

- `apps/tabler/templates/activity/dashboard.html` — request-activity stat row + tables
- `apps/tabler/templates/heartbeat/dashboard.html` — uptime monitoring with timelines
- `apps/tabler/templates/smallstack/dashboard.html` — minimal home dashboard
- `apps/tabler/templates/usermanager/timezone_dashboard.html` — timezone breakdown by city

## Anatomy of a dashboard

A Tabler dashboard typically has these regions, top to bottom:

1. **Page header** — title, pretitle, action buttons
2. **KPI / stat row** — 4-6 stat cards with key numbers
3. **Primary chart row** — 1-2 large charts (revenue, traffic, etc.)
4. **Secondary chart row** — donuts, smaller breakdowns, or grouped panels
5. **Table row** — recent activity, leaderboard, log entries

```django
{% extends "tabler/base.html" %}
{% load theme_tags %}

{% block title %}Dashboard{% endblock %}

{% block breadcrumbs %}
  {% breadcrumb "Home" "website:home" %}
  {% breadcrumb "Dashboard" %}
  {% render_tabler_breadcrumbs %}
{% endblock %}

{% block page_header %}
<div class="page-header d-print-none">
  <div class="container-xl">
    <div class="row g-2 align-items-center">
      <div class="col">
        <div class="page-pretitle">Overview</div>
        <h2 class="page-title">Dashboard</h2>
      </div>
      <div class="col-auto ms-auto d-print-none">
        <div class="btn-list">
          <a href="#" class="btn btn-outline-primary">Export</a>
          <a href="#" class="btn btn-primary">New report</a>
        </div>
      </div>
    </div>
  </div>
</div>
{% endblock %}

{% block content %}
{# 1. KPI row #}
{% include 'mydashboard/_kpi_row.html' %}

{# 2. Primary chart row #}
<div class="row row-deck row-cards mt-3">
  <div class="col-12 col-lg-8">
    {% include 'mydashboard/_revenue_chart.html' %}
  </div>
  <div class="col-12 col-lg-4">
    {% include 'mydashboard/_traffic_donut.html' %}
  </div>
</div>

{# 3. Table row #}
<div class="row row-deck row-cards mt-3">
  <div class="col-12">
    {% include 'mydashboard/_recent_table.html' %}
  </div>
</div>
{% endblock %}
```

## KPI / stat row patterns

### Pattern A: number + label + sparkline (most common)

```html
<div class="row row-deck row-cards">
  <div class="col-sm-6 col-lg-3">
    <div class="card card-sm">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col">
            <div class="subheader">Sessions</div>
            <div class="h1 mb-2">2,847</div>
            <div class="d-flex align-items-baseline gap-1">
              <span class="text-success d-inline-flex align-items-center lh-1">
                +12.5%
                <svg class="icon icon-sm ms-1">...</svg>
              </span>
              <span class="text-secondary small">vs last week</span>
            </div>
          </div>
          <div class="col-auto" style="width: 80px;">
            <div id="spark-sessions"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- repeat for each stat -->
</div>
```

Initialize sparklines with ApexCharts — see [charts.md](charts.md) for the snippet.

### Pattern B: icon + number + trend (from activity dashboard)

```html
<div class="col-sm-6 col-lg-3">
  <div class="card card-sm">
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-auto">
          <span class="bg-primary text-white avatar">
            <svg class="icon">...</svg>
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

### Pattern C: center-aligned big number (compact, info-dense — used in activity)

```html
<div class="col-sm-6 col-lg-2">
  <div class="card card-sm cursor-pointer"
       hx-get="{% url 'activity:stat_detail' 'requests' %}"
       hx-target="#stat-modal-body"
       onclick="openStatModal('Recent Requests')">
    <div class="card-body text-center">
      <div class="h1 mb-0 text-primary">{{ total_requests }}</div>
      <div class="text-secondary small">Requests</div>
    </div>
  </div>
</div>
```

Six of these fit a row (`col-lg-2 × 6`). Clickable cards trigger modals with detail. See `apps/tabler/templates/activity/dashboard.html` for the full example.

### Pattern D: progress bar / target

```html
<div class="card card-sm">
  <div class="card-body">
    <div class="d-flex align-items-baseline mb-2">
      <div class="subheader">Goal: 1000 signups</div>
      <div class="ms-auto"><strong>72%</strong></div>
    </div>
    <div class="progress progress-sm">
      <div class="progress-bar bg-success" style="width: 72%"></div>
    </div>
    <div class="text-secondary small mt-2">720 / 1000 in Q2</div>
  </div>
</div>
```

## Welcome / hero card

A "welcome" card combines greeting + mini-stats + progress:

```html
<div class="card welcome-card">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col">
        <h2 class="welcome-title">Good morning, {{ user.first_name|default:user.username }}</h2>
        <p class="text-secondary">Here's what's happening with your team today.</p>
        <div class="d-flex flex-wrap gap-4 mt-3">
          <div>
            <div class="mini-stat-value">12</div>
            <div class="mini-stat-label text-secondary">Tasks today</div>
          </div>
          <div>
            <div class="mini-stat-value">3</div>
            <div class="mini-stat-label text-secondary">Awaiting review</div>
          </div>
          <div>
            <div class="mini-stat-value text-success">98%</div>
            <div class="mini-stat-label text-secondary">Uptime</div>
          </div>
        </div>
      </div>
      <div class="col-auto d-none d-md-block">
        <svg width="120" height="120" class="text-primary opacity-25">...</svg>
      </div>
    </div>
  </div>
</div>
```

(`.welcome-card`, `.welcome-title`, `.mini-stat-*` are defined in `tabler_overrides.css`.)

## Primary chart card

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Revenue</h3>
    <div class="card-actions">
      <div class="btn-group btn-group-sm">
        <button class="btn btn-outline-primary active" data-range="7">7d</button>
        <button class="btn btn-outline-primary" data-range="30">30d</button>
        <button class="btn btn-outline-primary" data-range="90">90d</button>
      </div>
    </div>
  </div>
  <div class="card-body">
    <div id="chart-revenue" style="height: 320px;"></div>
  </div>
</div>
```

See [charts.md](charts.md) for the ApexCharts init.

### Range switcher via htmx

```html
<button class="btn btn-outline-primary"
        hx-get="{% url 'dashboard:revenue_data' %}?range=30"
        hx-target="#chart-revenue-data"
        hx-swap="none"
        hx-on::after-request="updateRevenueChart(JSON.parse(event.detail.xhr.responseText))">30d</button>
```

## Donut breakdown card

```html
<div class="card">
  <div class="card-header"><h3 class="card-title">Traffic sources</h3></div>
  <div class="card-body">
    <div id="chart-traffic" class="chart-donut-container" style="height: 240px;"></div>
    <div class="mt-3">
      <div class="d-flex align-items-center mb-1">
        <span class="status-dot bg-primary me-2"></span>
        Organic <span class="ms-auto fw-bold">44%</span>
      </div>
      <div class="d-flex align-items-center mb-1">
        <span class="status-dot bg-info me-2"></span>
        Direct <span class="ms-auto fw-bold">28%</span>
      </div>
      <div class="d-flex align-items-center">
        <span class="status-dot bg-warning me-2"></span>
        Referral <span class="ms-auto fw-bold">18%</span>
      </div>
    </div>
  </div>
</div>
```

## Recent activity table (in card)

```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Recent activity</h3>
    <div class="card-actions">
      <a href="{% url 'activity:dashboard' %}" class="btn btn-outline-primary btn-sm">View all</a>
    </div>
  </div>
  <div class="table-responsive">
    <table class="table card-table table-vcenter table-striped">
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
              <span class="avatar avatar-sm me-2 bg-primary-lt">{{ event.user.username|slice:":2"|upper }}</span>
              {{ event.user.username }}
            </div>
          </td>
          <td>{{ event.action }}</td>
          <td>{% localtime_tooltip event.timestamp %}</td>
          <td>
            {% if event.success %}<span class="badge bg-success-lt">OK</span>
            {% else %}<span class="badge bg-danger-lt">Error</span>{% endif %}
          </td>
        </tr>
        {% empty %}
        <tr><td colspan="4" class="text-center text-secondary py-4">No activity yet</td></tr>
        {% endfor %}
      </tbody>
    </table>
  </div>
</div>
```

## Status / uptime timeline

For service-monitoring dashboards (heartbeat-style), use thin colored bars per time slot:

```html
<div class="card">
  <div class="card-header"><h3 class="card-title">API uptime — last 90 days</h3></div>
  <div class="card-body">
    <div class="d-flex align-items-center gap-1" style="height: 32px;">
      {% for beat in beats %}
      <div title="{{ beat.date|date }}: {{ beat.status }}"
           data-bs-toggle="tooltip"
           style="flex: 1; height: 100%; background: {% if beat.success %}var(--success-fg){% else %}var(--error-fg){% endif %}; border-radius: 2px;"></div>
      {% endfor %}
    </div>
    <div class="d-flex justify-content-between mt-2 text-secondary small">
      <span>90 days ago</span>
      <span>{{ uptime_pct }}% uptime</span>
      <span>Today</span>
    </div>
  </div>
</div>
```

See `apps/tabler/templates/heartbeat/dashboard.html` for the real version.

## Real-time / live-updating dashboards

Combine htmx polling with ApexCharts:

```html
<div hx-get="{% url 'dashboard:metrics' %}"
     hx-trigger="every 10s"
     hx-swap="none"
     hx-on::after-request="applyMetrics(JSON.parse(event.detail.xhr.responseText))"></div>

<script>
function applyMetrics(data) {
  document.querySelectorAll('[data-stat]').forEach(el => {
    const key = el.dataset.stat;
    if (data[key] !== undefined) el.textContent = data[key];
  });
  // Update chart
  window.rpmChart?.updateSeries([{ data: data.rpm_points }]);
}
</script>
```

In templates:

```html
<div class="h1 mb-0 text-primary" data-stat="active_users">{{ active_users }}</div>
```

See [htmx-patterns.md](htmx-patterns.md) and [charts.md](charts.md).

## Layout choices

| Layout | When |
|--------|------|
| `default` (horizontal) | Most dashboards. Fits 4-6 KPI cards across. |
| `condensed` | Information-dense ops dashboards (heartbeat, activity). |
| `fluid` | Wide tables, kanban-style, full-screen telemetry. |
| `vertical` | Apps with many primary destinations (CRM, ecommerce). |

Pick via [layouts.md](layouts.md). User can override at runtime via the settings panel.

## Dashboard widget framework

SmallStack has a [`DashboardWidget`](../dashboard-widgets.md) protocol — register a widget class with the explorer or a standalone dashboard, and it appears automatically. Useful when:
- Multiple apps contribute cards to one dashboard
- Widgets need to be selectively shown by user role
- You want a JSON API for the same data

For one-off dashboards, just write the template directly — don't over-engineer with widgets.

## Multi-page dashboards (tabbed)

```html
<div class="card mb-3">
  <div class="card-body py-2">
    <ul class="nav nav-pills" id="dash-tabs">
      <li class="nav-item">
        <a class="nav-link active" data-bs-toggle="pill" href="#tab-overview">Overview</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="pill" href="#tab-users"
           hx-get="{% url 'dashboard:users_partial' %}"
           hx-target="#tab-users"
           hx-trigger="click once">Users</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-bs-toggle="pill" href="#tab-billing"
           hx-get="{% url 'dashboard:billing_partial' %}"
           hx-target="#tab-billing"
           hx-trigger="click once">Billing</a>
      </li>
    </ul>
  </div>
</div>

<div class="tab-content">
  <div class="tab-pane active" id="tab-overview">{# overview content #}</div>
  <div class="tab-pane" id="tab-users"></div>
  <div class="tab-pane" id="tab-billing"></div>
</div>
```

Lazy-loading tabs keeps initial dashboard load fast.

## Gotchas

- **Don't put more than 6 KPI cards per row** — they get cramped below `xl`. Cap at 4 for visual breathing room.
- **`row-deck` is essential for visual alignment** — without it, cards in the same row will have varying heights depending on their content.
- **Sparklines need explicit width** in the parent col — `style="width: 80px"` or similar.
- **Stat cards with `hx-get`** trigger on page load if you don't add `hx-trigger="click"` — they default to `click` for buttons but `load` for divs. Use `cursor-pointer` to indicate clickability.
- **Real-time polling on background tabs wastes battery** — use `hx-trigger="every 10s[document.visibilityState === 'visible']"`.
- **Charts inside hidden tabs render to a 0-width container** — wait for tab activation before initializing, or call `chart.updateOptions(...)` on `shown.bs.tab` event to recalculate.
- **Empty-state for tables inside cards** needs `<tr><td colspan="N"><div class="empty">...</div></td></tr>` — see [tables.md](tables.md).
- **Welcome card on small screens**: hide the right-side decorative SVG with `d-none d-md-block`.

## Related skills

- [components.md](components.md) — for stat cards, badges, status dots
- [charts.md](charts.md) — for ApexCharts patterns used in dashboards
- [tables.md](tables.md) — for the recent-activity table pattern
- [htmx-patterns.md](htmx-patterns.md) — for live updates and tabbed loading
- [layouts.md](layouts.md) — for picking the right page layout
- [../dashboard-widgets.md](../dashboard-widgets.md) — for the DashboardWidget protocol
