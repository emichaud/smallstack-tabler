# Page recipe — API explorer / documentation

**Use this skill when** building a page that documents REST endpoints, lets users try them with auth tokens, shows request/response examples, generates client snippets, or browses an OpenAPI spec.

## Tabler references

- Preview: https://preview.tabler.io/cards-jobs.html — list-of-cards pattern adaptable to endpoints
- Stripe API docs (design inspiration): https://stripe.com/docs/api
- Mintlify / ReDoc / Swagger UI for reference

## In-repo references

- `apps/smallstack/crud/` — JSON API auto-generated for every CRUDView model
- `apps/explorer/` — the SmallStack model explorer (good adjacent pattern)
- `docs/skills/api.md`, `docs/skills/api-discovery.md`, `docs/skills/custom-api-endpoints.md` — what's documented
- SmallStack OpenAPI spec endpoint: `/api/schema/` (if enabled in settings)

## Mental model

An API explorer has 5 zones:

1. **Sidebar** — endpoint list grouped by resource
2. **Endpoint header** — method + path + summary
3. **Description** — markdown documentation
4. **Request panel** — parameters, headers, body, "Try it" button
5. **Response panel** — example responses + actual response from try-it

## Full layout

```django
{% extends "tabler/base.html" %}
{% load static %}

{% block title %}API · {{ endpoint.name }}{% endblock %}

{% block body_class %}layout-fluid{% endblock %}

{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">
<style>
.api-sidebar { background: var(--tblr-card-bg); border-right: 1px solid var(--tblr-border-color); height: calc(100vh - 60px); overflow-y: auto; position: sticky; top: 60px; }
.api-sidebar .nav-link { padding: 0.25rem 0.75rem; font-size: 0.875rem; }
.api-sidebar .nav-link.active { background: var(--tblr-primary-lt); color: var(--tblr-primary); }
.method-badge { font-family: monospace; font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 4px; min-width: 50px; text-align: center; }
.method-GET    { background: rgba(47,179,68,0.15);   color: #2fb344; }
.method-POST   { background: rgba(66,153,225,0.15);  color: #4299e1; }
.method-PUT    { background: rgba(247,103,7,0.15);   color: #f76707; }
.method-PATCH  { background: rgba(245,159,0,0.15);   color: #f59f00; }
.method-DELETE { background: rgba(214,57,57,0.15);   color: #d63939; }
</style>
{% endblock %}

{% block content %}
<div class="row g-0">
  <!-- Sidebar -->
  <aside class="col-md-3 col-lg-2 api-sidebar p-3">
    <div class="input-icon mb-3">
      <span class="input-icon-addon"><svg class="icon">...</svg></span>
      <input type="search" id="endpoint-search" class="form-control form-control-sm" placeholder="Search...">
    </div>
    {% for group in endpoint_groups %}
    <div class="mb-3">
      <div class="subheader mb-2">{{ group.name }}</div>
      <nav class="nav flex-column">
        {% for ep in group.endpoints %}
        <a href="{{ ep.get_absolute_url }}"
           class="nav-link d-flex align-items-center gap-2 {% if ep == endpoint %}active{% endif %}"
           data-search="{{ ep.method }} {{ ep.path }}">
          <span class="method-badge method-{{ ep.method }}">{{ ep.method }}</span>
          <span class="text-truncate">{{ ep.path_display }}</span>
        </a>
        {% endfor %}
      </nav>
    </div>
    {% endfor %}
  </aside>

  <!-- Main content -->
  <main class="col-md-9 col-lg-10 px-4 py-3">
    <div class="row">

      <!-- Description -->
      <div class="col-xl-6">
        <div class="d-flex align-items-center gap-3 mb-3">
          <span class="method-badge method-{{ endpoint.method }}">{{ endpoint.method }}</span>
          <code class="fs-4">{{ endpoint.path }}</code>
        </div>
        <h1 class="page-title">{{ endpoint.name }}</h1>
        <p class="text-secondary">{{ endpoint.summary }}</p>

        <div class="markdown">{{ endpoint.description_html|safe }}</div>

        {% include 'api/_parameters.html' %}
        {% include 'api/_responses.html' %}
      </div>

      <!-- Code panel -->
      <div class="col-xl-6">
        <div class="position-sticky" style="top: 80px;">
          {% include 'api/_try_it.html' %}
          {% include 'api/_code_examples.html' %}
        </div>
      </div>

    </div>
  </main>
</div>
{% endblock %}

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-core.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
{% endblock %}
```

The `layout-fluid` body class gives edge-to-edge horizontal real estate.

## Endpoint sidebar with search

```html
<input type="search" id="endpoint-search" class="form-control form-control-sm" placeholder="Search endpoints...">

<script>
document.getElementById('endpoint-search').addEventListener('input', function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll('[data-search]').forEach(el => {
    const matches = el.dataset.search.toLowerCase().includes(q);
    el.style.display = matches ? '' : 'none';
  });
});
</script>
```

For a real search across paths + descriptions, use List.js or a server-side endpoint with htmx — see [page-content.md](page-content.md).

## Parameters table

```django
{# api/_parameters.html #}
<h3 class="mt-4">Parameters</h3>
<div class="table-responsive">
  <table class="table table-vcenter">
    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>In</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {% for p in endpoint.parameters %}
      <tr>
        <td>
          <code>{{ p.name }}</code>
          {% if p.required %}<span class="badge bg-red-lt ms-1">required</span>{% endif %}
        </td>
        <td><span class="text-secondary">{{ p.type }}</span></td>
        <td><span class="badge bg-blue-lt">{{ p.location }}</span></td>
        <td>{{ p.description }}</td>
      </tr>
      {% endfor %}
    </tbody>
  </table>
</div>
```

## Responses

```django
{# api/_responses.html #}
<h3 class="mt-4">Responses</h3>

<ul class="nav nav-tabs mb-3">
  {% for r in endpoint.responses %}
  <li class="nav-item">
    <a class="nav-link {% if forloop.first %}active{% endif %}" data-bs-toggle="tab" href="#response-{{ r.status }}">
      <span class="badge bg-{% if r.status < 300 %}success{% elif r.status < 500 %}warning{% else %}danger{% endif %}-lt">
        {{ r.status }}
      </span>
      {{ r.label }}
    </a>
  </li>
  {% endfor %}
</ul>

<div class="tab-content">
  {% for r in endpoint.responses %}
  <div class="tab-pane {% if forloop.first %}show active{% endif %}" id="response-{{ r.status }}">
    <p class="text-secondary">{{ r.description }}</p>
    <pre><code class="language-json">{{ r.example_json }}</code></pre>
  </div>
  {% endfor %}
</div>
```

## "Try it" panel

```django
{# api/_try_it.html #}
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Try it</h3>
  </div>
  <div class="card-body">
    <div class="mb-3">
      <label class="form-label">Bearer token</label>
      <div class="input-group">
        <input type="password" class="form-control" id="api-token"
               placeholder="paste your token" value="{{ request.session.api_token|default:'' }}">
        <button class="btn" type="button" id="token-save">Save</button>
      </div>
      <small class="form-hint">Saved to session for this browser only.</small>
    </div>

    {% for p in endpoint.tryable_parameters %}
    <div class="mb-3">
      <label class="form-label">{{ p.name }} <span class="text-secondary small">({{ p.type }})</span></label>
      <input type="{{ p.html_input_type }}" class="form-control"
             id="param-{{ p.name }}" data-param="{{ p.name }}" data-in="{{ p.location }}"
             placeholder="{{ p.example|default:p.description }}">
    </div>
    {% endfor %}

    {% if endpoint.has_body %}
    <div class="mb-3">
      <label class="form-label">Request body</label>
      <textarea class="form-control" id="request-body" rows="8"
                style="font-family: var(--tblr-font-monospace); font-size: 0.875rem;">{{ endpoint.body_example_json }}</textarea>
    </div>
    {% endif %}

    <button class="btn btn-primary" id="try-it-btn">
      <svg class="icon me-1">...</svg> Send request
    </button>
  </div>
</div>

<div class="card mt-3 d-none" id="try-result">
  <div class="card-header">
    <h3 class="card-title">Response</h3>
    <div class="card-actions">
      <span class="badge" id="result-status"></span>
      <span class="text-secondary small ms-2" id="result-time"></span>
    </div>
  </div>
  <div class="card-body">
    <pre><code class="language-json" id="result-body"></code></pre>
  </div>
</div>

<script>
document.getElementById('token-save').addEventListener('click', () => {
  const token = document.getElementById('api-token').value;
  fetch('/internal/save-token/', {
    method: 'POST',
    headers: { 'X-CSRFToken': '{{ csrf_token }}', 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
});

document.getElementById('try-it-btn').addEventListener('click', async () => {
  const token = document.getElementById('api-token').value;
  const method = '{{ endpoint.method }}';
  let url = '{{ endpoint.path }}';
  const queryParams = new URLSearchParams();

  document.querySelectorAll('[data-param]').forEach(input => {
    const name = input.dataset.param;
    const loc = input.dataset.in;
    const v = input.value;
    if (!v) return;
    if (loc === 'path') url = url.replace(`{${name}}`, v);
    else if (loc === 'query') queryParams.append(name, v);
  });

  if (queryParams.toString()) url += '?' + queryParams.toString();

  const body = document.getElementById('request-body')?.value;
  const opts = {
    method,
    headers: { Authorization: 'Bearer ' + token },
  };
  if (method !== 'GET' && body) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = body;
  }

  const t0 = performance.now();
  const resp = await fetch(url, opts);
  const ms = Math.round(performance.now() - t0);
  const data = await resp.text();

  const resultCard = document.getElementById('try-result');
  resultCard.classList.remove('d-none');
  const status = document.getElementById('result-status');
  status.textContent = resp.status + ' ' + resp.statusText;
  status.className = 'badge bg-' + (resp.ok ? 'success' : 'danger') + '-lt';
  document.getElementById('result-time').textContent = ms + 'ms';

  let pretty = data;
  try { pretty = JSON.stringify(JSON.parse(data), null, 2); } catch {}
  const codeEl = document.getElementById('result-body');
  codeEl.textContent = pretty;
  Prism.highlightElement(codeEl);
});
</script>
```

## Code examples for multiple languages

```django
{# api/_code_examples.html #}
<div class="card mt-3">
  <div class="card-header">
    <h3 class="card-title">Code examples</h3>
    <div class="card-actions">
      <button class="btn btn-sm btn-icon" data-clipboard-target=".tab-pane.show pre code">
        <svg class="icon">...</svg>
      </button>
    </div>
  </div>
  <ul class="nav nav-tabs nav-fill" role="tablist">
    {% for lang in code_examples %}
    <li class="nav-item">
      <a class="nav-link {% if forloop.first %}active{% endif %}"
         data-bs-toggle="tab" href="#code-{{ lang.id }}">{{ lang.name }}</a>
    </li>
    {% endfor %}
  </ul>
  <div class="card-body p-0">
    <div class="tab-content">
      {% for lang in code_examples %}
      <div class="tab-pane {% if forloop.first %}show active{% endif %}" id="code-{{ lang.id }}">
        <pre class="mb-0"><code class="language-{{ lang.prism }}">{{ lang.code }}</code></pre>
      </div>
      {% endfor %}
    </div>
  </div>
</div>
```

Generate examples server-side from the endpoint spec:

```python
def code_examples_for(endpoint):
    return [
        { 'id': 'curl', 'name': 'cURL', 'prism': 'bash', 'code': generate_curl(endpoint) },
        { 'id': 'py',   'name': 'Python', 'prism': 'python', 'code': generate_python(endpoint) },
        { 'id': 'js',   'name': 'JavaScript', 'prism': 'javascript', 'code': generate_js(endpoint) },
        { 'id': 'go',   'name': 'Go', 'prism': 'go', 'code': generate_go(endpoint) },
    ]
```

## OpenAPI integration

SmallStack's CRUDView API exposes an OpenAPI spec (if enabled). Read it in the view:

```python
import requests

def api_index(request):
    schema = requests.get(request.build_absolute_uri('/api/schema/')).json()
    return render(request, 'api/index.html', {
        'endpoints': iter_endpoints(schema),
    })
```

Where `iter_endpoints` walks the `paths` dict and yields per-endpoint structures.

For a drop-in spec viewer, use [ReDoc](https://github.com/Redocly/redoc) or [Swagger UI](https://swagger.io/tools/swagger-ui/) embedded:

```html
<div id="redoc-container"></div>
<script src="https://cdn.jsdelivr.net/npm/redoc@2/bundles/redoc.standalone.js"></script>
<script>
Redoc.init('/api/schema/', { theme: { colors: { primary: { main: '#f59f00' } } } }, document.getElementById('redoc-container'));
</script>
```

For SmallStack's API discovery patterns, see [../api-discovery.md](../api-discovery.md).

## Status badges for endpoints

```html
<span class="badge bg-success-lt">Stable</span>
<span class="badge bg-warning-lt">Beta</span>
<span class="badge bg-danger-lt">Deprecated</span>
<span class="badge bg-blue-lt">Preview</span>
```

Add to each sidebar entry and endpoint header.

## Auth helper

Show users how to get a token:

```html
<div class="alert alert-info">
  <h4>Need a token?</h4>
  <p class="mb-2">Get a personal access token from your settings.</p>
  <a href="{% url 'profile_api_tokens' %}" class="btn btn-sm btn-primary">Manage tokens</a>
</div>
```

For SmallStack's token system (system tokens vs login tokens), see [../api.md](../api.md).

## Inline schema explorer

For request/response schemas, render the JSON Schema as a collapsible tree:

```html
<div class="schema-tree">
  <details>
    <summary><code>user</code> <span class="text-secondary small">object</span></summary>
    <div class="ps-3">
      <details>
        <summary><code>id</code> <span class="text-secondary small">integer</span></summary>
        <div class="ps-3 text-secondary small">Unique user identifier.</div>
      </details>
      <details>
        <summary><code>email</code> <span class="text-secondary small">string</span></summary>
        <div class="ps-3 text-secondary small">Email address.</div>
      </details>
    </div>
  </details>
</div>

<style>
.schema-tree details { padding: 0.25rem 0; border-left: 2px solid transparent; }
.schema-tree summary { cursor: pointer; padding: 0.25rem 0; list-style: none; }
.schema-tree summary::-webkit-details-marker { display: none; }
.schema-tree summary::before { content: '▶ '; display: inline-block; transition: transform 100ms; font-size: 0.75em; }
.schema-tree details[open] > summary::before { transform: rotate(90deg); }
</style>
```

## Versioning

```html
<div class="d-flex align-items-center gap-2 mb-3">
  <select class="form-select form-select-sm w-auto" id="api-version">
    <option value="v1">v1 (current)</option>
    <option value="v2">v2 (beta)</option>
  </select>
  <span class="text-secondary small">Choose API version</span>
</div>
```

On change, navigate to `/api/{version}/...` or update query strings.

## Gotchas

- **Don't expose your real API token in the page** — show only when authenticated, store in session (httponly cookie) not localStorage.
- **CSRF tokens are NOT needed for Bearer-token authenticated API calls** — but Django's `csrf_exempt` decorator is needed on the API views, OR use the SmallStack CRUDView which handles this.
- **"Try it" with same-origin works**; cross-origin requires CORS configuration. See [../api.md](../api.md) CORS section.
- **Prism syntax highlighting needs `.textContent =` not `.innerHTML =`** when injecting dynamic code, otherwise HTML entities mis-render.
- **Code blocks in tabs sometimes don't highlight on first render** — Prism scans on `DOMContentLoaded`. After tab switch, call `Prism.highlightElement(code)` for the visible block.
- **`layout-fluid` removes max-width** — good for explorer layouts but the sidebar needs explicit width via the grid (`col-md-3 col-lg-2`).
- **Sidebar `position: sticky` requires `overflow: visible` on all ancestors** — wrapping the sidebar in another scrollable container breaks it.
- **The vertical scrollbar inside the sidebar takes space** — add `scrollbar-gutter: stable` so the layout doesn't jump.

## Related skills

- [page-content.md](page-content.md) — for the docs-style three-column layout
- [icons-typography.md](icons-typography.md) — for Prism code highlighting setup
- [components.md](components.md) — for tabs, alerts, modals used here
- [forms.md](forms.md) — for the try-it form
- [htmx-patterns.md](htmx-patterns.md) — for live search + responses
- [../api.md](../api.md), [../api-discovery.md](../api-discovery.md), [../custom-api-endpoints.md](../custom-api-endpoints.md) — for SmallStack's API itself
