# Charts — ApexCharts patterns for Tabler

**Use this skill when** adding any chart: line, area, bar, donut, radial, heatmap, sparkline; making charts respect theme + accent color; updating charts live via htmx.

## Tabler references

- Docs: https://docs.tabler.io/ui/components/charts
- ApexCharts docs: https://apexcharts.com/docs/installation/
- ApexCharts examples: https://apexcharts.com/docs/chart-types/line-chart/ (and other chart-type subpages)

## In-repo references

- `apps/tabler/templates/activity/dashboard.html` lines 100-280 — dashboard with chart rows
- `apps/tabler/templates/heartbeat/dashboard.html` — uptime + status visualizations
- `apps/tabler/static/tabler/css/tabler_overrides.css` — `.chart-donut-container`, `.chart-donut-label`, `.sparkline-container` classes

## Loading ApexCharts

ApexCharts is **not in the base template** — load it on pages that need it:

```django
{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // chart init here
});
</script>
{% endblock %}
```

## Theme-aware colors — the canonical pattern

Always read CSS variables at runtime so charts adapt to the user's accent color choice:

```js
const styles = getComputedStyle(document.documentElement);
const primary = styles.getPropertyValue('--tblr-primary').trim();
const muted   = styles.getPropertyValue('--tblr-muted').trim();
const border  = styles.getPropertyValue('--tblr-border-color').trim();
const body    = styles.getPropertyValue('--tblr-body-color').trim();
```

Use these in chart configs:

```js
new ApexCharts(el, {
  colors: [primary],
  grid: { borderColor: border, strokeDashArray: 4 },
  legend: { labels: { colors: body } },
  xaxis: { labels: { style: { colors: muted } }, axisBorder: { color: border } },
  yaxis: { labels: { style: { colors: muted } } },
  tooltip: { theme: document.body.classList.contains('theme-dark') ? 'dark' : 'light' },
}).render();
```

## Line chart

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Daily signups</h3>
    <div id="chart-signups" style="height: 240px;"></div>
  </div>
</div>

<script>
const styles = getComputedStyle(document.documentElement);
new ApexCharts(document.getElementById('chart-signups'), {
  chart: { type: 'line', height: 240, toolbar: { show: false }, animations: { enabled: false } },
  series: [{ name: 'Signups', data: [12, 18, 9, 24, 30, 21, 35] }],
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  colors: [styles.getPropertyValue('--tblr-primary').trim()],
  stroke: { width: 2, curve: 'smooth' },
  grid: { strokeDashArray: 4, borderColor: styles.getPropertyValue('--tblr-border-color').trim() },
  legend: { position: 'bottom' },
}).render();
</script>
```

## Area chart (filled line)

```js
new ApexCharts(el, {
  chart: { type: 'area', height: 240, toolbar: { show: false } },
  series: [{ name: 'Revenue', data: [200, 280, 215, 340, 410, 390, 480] }],
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  colors: [primary],
  stroke: { width: 2, curve: 'smooth' },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0, stops: [0, 100] }
  },
  grid: { strokeDashArray: 4 },
  dataLabels: { enabled: false },
}).render();
```

## Bar chart

```js
new ApexCharts(el, {
  chart: { type: 'bar', height: 240, toolbar: { show: false } },
  series: [{ name: 'Errors', data: [4, 7, 3, 12, 9, 5, 2] }],
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  colors: [primary],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
  dataLabels: { enabled: false },
  grid: { strokeDashArray: 4 },
}).render();
```

### Stacked bar

```js
{
  chart: { type: 'bar', stacked: true },
  series: [
    { name: '2xx', data: [120, 150, 90, 140] },
    { name: '4xx', data: [10, 12, 8, 15] },
    { name: '5xx', data: [2, 1, 4, 3] }
  ],
  colors: ['#2fb344', '#f76707', '#d63939'],
}
```

### Horizontal bar

```js
{
  chart: { type: 'bar' },
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  series: [{ data: [44, 55, 41, 67, 22, 43] }],
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
}
```

## Donut / pie

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Browser share</h3>
    <div id="chart-browsers" style="height: 240px;"></div>
  </div>
</div>

<script>
new ApexCharts(document.getElementById('chart-browsers'), {
  chart: { type: 'donut', height: 240 },
  series: [44, 35, 18, 3],
  labels: ['Chrome', 'Safari', 'Firefox', 'Other'],
  colors: ['#206bc4', '#4299e1', '#f76707', '#d6336c'],
  legend: { position: 'bottom' },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: { show: true, label: 'Sessions', formatter: () => '12.4k' }
        }
      }
    }
  }
}).render();
</script>
```

## Radial / gauge

```js
new ApexCharts(el, {
  chart: { type: 'radialBar', height: 240 },
  series: [78],
  labels: ['Uptime'],
  colors: [primary],
  plotOptions: {
    radialBar: {
      hollow: { size: '65%' },
      dataLabels: {
        name: { fontSize: '0.875rem', color: muted },
        value: { fontSize: '1.5rem', color: body, formatter: v => v + '%' }
      }
    }
  },
}).render();
```

## Sparkline (in-card mini-chart)

```html
<div class="card card-sm">
  <div class="card-body">
    <div class="row align-items-center">
      <div class="col">
        <div class="subheader">Sessions</div>
        <div class="h1 mb-0">2,847</div>
      </div>
      <div class="col-auto" style="width: 80px;">
        <div id="spark-1"></div>
      </div>
    </div>
  </div>
</div>

<script>
new ApexCharts(document.getElementById('spark-1'), {
  chart: {
    type: 'area', height: 40, sparkline: { enabled: true },
    animations: { enabled: false }
  },
  series: [{ data: [10, 15, 8, 18, 22, 17, 25] }],
  stroke: { width: 1.5 },
  colors: [primary],
  fill: { opacity: 0.16 },
  tooltip: { enabled: false },
}).render();
</script>
```

`sparkline: { enabled: true }` strips all chrome — axes, grid, labels — leaving just the line.

## Heatmap

```js
new ApexCharts(el, {
  chart: { type: 'heatmap', height: 280 },
  series: [
    { name: 'Mon', data: gen() },
    { name: 'Tue', data: gen() },
    { name: 'Wed', data: gen() },
  ],
  colors: [primary],
  dataLabels: { enabled: false },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      colorScale: {
        ranges: [
          { from: 0,  to: 20, color: styles.getPropertyValue('--tblr-gray-200').trim() },
          { from: 21, to: 40, color: '#a5d8ff' },
          { from: 41, to: 80, color: primary },
        ]
      }
    }
  }
}).render();

function gen() {
  return Array.from({length: 24}, (_, h) => ({x: h + 'h', y: Math.floor(Math.random() * 80)}));
}
```

Good for activity-by-hour or weekly usage patterns.

## Reacting to theme changes

When the user toggles dark/light or switches accent color, charts won't auto-update. Listen for the change and re-render:

```js
const chartInstances = [];   // collect every ApexCharts instance

function applyChartTheme(chart) {
  const styles = getComputedStyle(document.documentElement);
  const isDark = document.body.classList.contains('theme-dark');
  chart.updateOptions({
    colors: [styles.getPropertyValue('--tblr-primary').trim()],
    grid: { borderColor: styles.getPropertyValue('--tblr-border-color').trim() },
    xaxis: { labels: { style: { colors: styles.getPropertyValue('--tblr-muted').trim() } } },
    yaxis: { labels: { style: { colors: styles.getPropertyValue('--tblr-muted').trim() } } },
    tooltip: { theme: isDark ? 'dark' : 'light' },
  }, false, true);
}

// Watch for class change on body (theme toggle)
new MutationObserver(() => chartInstances.forEach(applyChartTheme))
  .observe(document.body, { attributes: true, attributeFilter: ['class'] });

// Watch for primary color change (settings panel)
new MutationObserver(() => chartInstances.forEach(applyChartTheme))
  .observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
```

Append your charts:

```js
const chart = new ApexCharts(el, opts);
chart.render();
chartInstances.push(chart);
```

## Live updates via htmx

For dashboards that auto-refresh, fetch new data periodically:

```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">Requests / min</h3>
    <div id="chart-rpm" style="height: 200px;"></div>
  </div>
</div>

<div hx-get="{% url 'activity:rpm_data' %}"
     hx-trigger="every 10s"
     hx-target="this" hx-swap="none"
     hx-on::after-request="updateChart(JSON.parse(event.detail.xhr.responseText))">
</div>

<script>
let chart;
function updateChart(data) {
  if (!chart) {
    chart = new ApexCharts(document.getElementById('chart-rpm'), {
      chart: { type: 'line', height: 200, animations: { enabled: false } },
      series: [{ name: 'RPM', data: data.points }],
      colors: [getComputedStyle(document.documentElement).getPropertyValue('--tblr-primary').trim()],
    });
    chart.render();
  } else {
    chart.updateSeries([{ name: 'RPM', data: data.points }]);
  }
}
</script>
```

View returns JSON:

```python
from django.http import JsonResponse

def rpm_data(request):
    return JsonResponse({"points": compute_recent_rpm()})
```

## Mixed chart (line + bar)

```js
new ApexCharts(el, {
  chart: { height: 280 },
  series: [
    { name: 'Bookings', type: 'column', data: [10, 14, 8, 21, 16] },
    { name: 'Revenue', type: 'line', data: [200, 280, 165, 410, 350] }
  ],
  stroke: { width: [0, 3], curve: 'smooth' },
  colors: [primary, '#2fb344'],
  yaxis: [
    { title: { text: 'Bookings' } },
    { opposite: true, title: { text: 'Revenue ($)' } }
  ],
}).render();
```

## Range chart (uptime / SLA visualization)

```js
new ApexCharts(el, {
  chart: { type: 'rangeBar', height: 300 },
  plotOptions: { bar: { horizontal: true, distributed: true, dataLabels: { hideOverflowingLabels: false } } },
  series: [{
    data: [
      { x: 'api.example.com',   y: [new Date('2026-06-01').getTime(), new Date('2026-06-09').getTime()], fillColor: '#2fb344' },
      { x: 'web.example.com',   y: [new Date('2026-06-03').getTime(), new Date('2026-06-04').getTime()], fillColor: '#d63939' },
    ]
  }],
  xaxis: { type: 'datetime' },
}).render();
```

## Static colors via CSS class

If you only need the accent color, you can skip the dynamic-style approach and rely on Tabler's `--tblr-primary` variable being current:

```html
<div id="chart" data-color="primary"></div>
<script>
const el = document.getElementById('chart');
const color = el.dataset.color === 'primary'
  ? getComputedStyle(document.documentElement).getPropertyValue('--tblr-primary').trim()
  : el.dataset.color;
new ApexCharts(el, { ..., colors: [color] }).render();
</script>
```

## Multi-axis legend customization

```js
{
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    markers: { width: 10, height: 10, radius: 2 },
    labels: { colors: body },
  },
}
```

## Tooltips

```js
{
  tooltip: {
    theme: 'dark',
    y: { formatter: v => v + ' users' },
    x: { format: 'MMM dd, yyyy' },
  },
}
```

For HTML tooltips:

```js
{
  tooltip: {
    custom: function({ series, seriesIndex, dataPointIndex }) {
      return `<div class="px-3 py-2">
        <strong>${series[seriesIndex][dataPointIndex]}</strong>
        <div class="text-secondary small">visits</div>
      </div>`;
    }
  }
}
```

## Chart.js (alternative — used in some legacy parts of this repo)

If you'd rather use Chart.js for sparklines or simple visualizations, it's already used in the SmallStack base. Both can coexist:

```html
<canvas id="cjs-chart"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
new Chart(document.getElementById('cjs-chart'), {
  type: 'line',
  data: { labels: ['Mon','Tue','Wed'], datasets: [{ data: [10, 20, 15], borderColor: '#f59f00' }] },
});
</script>
```

Prefer ApexCharts for new charts — it has more chart types out of the box and matches Tabler's visual language.

## Gotchas

- **ApexCharts must run after `DOMContentLoaded`** — the container needs to exist + have a measured size. Wrapping in the listener is safest.
- **`animations: { enabled: false }`** is recommended for dashboards with many charts (initial render is faster, no jank).
- **Reading `--tblr-primary` inline (in chart options) reads the value once.** If the user changes accent later, the chart stays the old color until you call `updateOptions` — see "Reacting to theme changes".
- **Sparklines need an explicit width** — set `style="width: 80px"` or similar on the container; `sparkline: { enabled: true }` doesn't size itself.
- **`toolbar: { show: false }`** removes the export PNG / zoom buttons. For exportable dashboards, leave it on.
- **HTMX `hx-get` swap replacing a chart container** destroys the ApexCharts instance silently. Either render the new chart from a script in the swapped HTML, or keep the chart container outside the swap target and only update data via `chart.updateSeries(...)`.
- **Stacked area + multiple series** can have transparency stacking issues. Set `fill: { opacity: 0.5 }` and inspect — sometimes solid bar is clearer.
- **Radial bar `series` is a number, not an object.** Easy to mistake when copying line-chart configs.
- **Donut chart total formatter** requires `plotOptions.pie.donut.labels.total.show: true`.
- **Y-axis label color** must be set under `yaxis.labels.style.colors` — note the `s` on colors. Easy to mistype.

## Related skills

- [page-dashboards.md](page-dashboards.md) — putting charts in the right card layouts
- [theming.md](theming.md) — for the CSS vars charts read
- [htmx-patterns.md](htmx-patterns.md) — for chart live-updates
- [components.md](components.md) — for the surrounding cards
