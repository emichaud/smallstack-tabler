# Page recipe — marketing / landing pages

**Use this skill when** building hero pages, pricing tables, feature grids, testimonials, FAQ sections, CTAs, "about" pages, changelogs, product pages.

## Tabler references

- Preview: https://preview.tabler.io/pricing.html
- Preview: https://preview.tabler.io/cards-section.html — feature grids
- Preview: https://preview.tabler.io/cards-jobs.html — listing layouts
- Preview: https://preview.tabler.io/empty.html — minimal hero
- Preview: https://preview.tabler.io/404.html — error pages

## In-repo examples

- `apps/website/templates/website/about.html` — about page with hero, features, embedded slides
- `apps/website/templates/website/home.html` — landing-style home (if present)
- `apps/website/templates/website/changelog.html` — release-log style content
- `apps/website/` is the "website app" pattern for marketing-side pages

## SmallStack "website app" pattern

Marketing pages typically live in `apps/website/` (or similar). They:
- Use the same `tabler/base.html` so navbar/theme are consistent
- Are public (no `LoginRequiredMixin`)
- Use the `website:` URL namespace
- Are listed in the navbar via the content nav (Home, Help, About, etc.)

See [../adding-your-own-theme.md](../adding-your-own-theme.md) and [../theme-scenarios.md](../theme-scenarios.md) for the broader pattern.

## Hero section

### Centered hero with CTA

```html
{% extends "tabler/base.html" %}
{% load static %}

{% block content %}
<section class="text-center py-6">
  <div class="container container-tight">
    <h1 class="display-3 fw-bold">Ship faster with {{ brand.name }}</h1>
    <p class="lead text-secondary mt-3">
      The Django starter that gets you from idea to production in a weekend.
    </p>
    <div class="btn-list justify-content-center mt-4">
      <a href="{% url 'signup' %}" class="btn btn-primary btn-lg">
        Get started free
        <svg class="icon ms-2">...</svg>
      </a>
      <a href="https://github.com/emichaud/django-smallstack" class="btn btn-outline-secondary btn-lg">
        <svg class="icon me-2">...</svg> View on GitHub
      </a>
    </div>
    <p class="text-secondary mt-3 small">No credit card required.</p>
  </div>
</section>
{% endblock %}
```

### Split hero (text + image)

```html
<section class="py-6">
  <div class="container-xl">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <h1 class="display-4 fw-bold">Built for builders.</h1>
        <p class="lead text-secondary mt-3">
          Skip the boilerplate. Focus on what makes your app unique.
        </p>
        <div class="btn-list mt-4">
          <a href="#features" class="btn btn-primary btn-lg">See features</a>
          <a href="{% url 'help:index' %}" class="btn btn-link btn-lg">Read the docs</a>
        </div>
      </div>
      <div class="col-lg-6">
        <img src="{% static 'img/hero-screenshot.png' %}"
             alt="Product screenshot"
             class="img-fluid rounded shadow-lg">
      </div>
    </div>
  </div>
</section>
```

### Hero with gradient background + overlay navbar

Pair with `navbar-overlap` layout (see [layouts.md](layouts.md)):

```html
{% block extra_css %}
<script>
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.navbar')?.classList.add('navbar-overlap');
});
</script>
<style>
  .hero-gradient {
    background: linear-gradient(135deg, var(--tblr-primary), #d6336c);
    color: #fff;
    padding: 8rem 0 6rem;
    margin-top: -64px;  /* match navbar height */
  }
  .hero-gradient .text-secondary { color: rgba(255,255,255,0.85) !important; }
  .hero-gradient .btn-outline-secondary { color: #fff; border-color: rgba(255,255,255,0.5); }
</style>
{% endblock %}

{% block content %}
<section class="hero-gradient text-center">
  <div class="container container-tight">
    <h1 class="display-2 fw-bold">Ship faster</h1>
    <p class="lead">The Django starter for ambitious teams.</p>
    <a class="btn btn-light btn-lg mt-4">Get started →</a>
  </div>
</section>
{% endblock %}
```

## Feature grid

### Three-column with icons

```html
<section class="py-6" id="features">
  <div class="container-xl">
    <div class="text-center mb-5">
      <div class="subheader">Why SmallStack</div>
      <h2 class="h1 mt-2">Everything you need to ship</h2>
    </div>
    <div class="row row-cards g-4">
      {% for f in features %}
      <div class="col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="mb-3">
              <span class="avatar avatar-lg bg-primary-lt">
                <svg class="icon icon-md">...</svg>
              </span>
            </div>
            <h3 class="card-title">{{ f.title }}</h3>
            <p class="text-secondary">{{ f.description }}</p>
          </div>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>
```

### Alternating left-right feature blocks

```html
<section class="py-6">
  <div class="container-xl">
    {% for feature in features %}
    <div class="row align-items-center g-5 {% cycle '' 'flex-row-reverse' %} mb-6">
      <div class="col-lg-6">
        <img src="{% static feature.image %}" class="img-fluid rounded">
      </div>
      <div class="col-lg-6">
        <div class="subheader text-primary">{{ feature.tag }}</div>
        <h2 class="h1 mt-2">{{ feature.title }}</h2>
        <p class="text-secondary mt-3">{{ feature.description|linebreaks }}</p>
        <ul class="list-unstyled mt-3">
          {% for point in feature.points %}
          <li class="d-flex align-items-center mb-2">
            <svg class="icon text-success me-2">...</svg>
            {{ point }}
          </li>
          {% endfor %}
        </ul>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
```

## Pricing tables

### Three-tier (most common)

```html
<section class="py-6">
  <div class="container-xl">
    <div class="text-center mb-5">
      <h2 class="display-5 fw-bold">Simple pricing</h2>
      <p class="lead text-secondary">No hidden fees. Cancel anytime.</p>
    </div>
    <div class="row row-cards g-4 justify-content-center">

      <!-- Free -->
      <div class="col-md-4">
        <div class="card card-md h-100">
          <div class="card-body text-center">
            <div class="subheader">Free</div>
            <div class="display-5 fw-bold my-3">$0<small class="fs-4 text-secondary">/mo</small></div>
            <p class="text-secondary">For hobby projects.</p>
            <ul class="list-unstyled text-start my-4">
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> Up to 1 project</li>
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> 100 MB storage</li>
              <li class="mb-2"><svg class="icon text-muted me-1">...</svg> <span class="text-muted">Custom domain</span></li>
            </ul>
            <a href="{% url 'signup' %}" class="btn btn-outline-primary w-100">Get started</a>
          </div>
        </div>
      </div>

      <!-- Pro (highlighted) -->
      <div class="col-md-4">
        <div class="card card-md h-100 border-primary position-relative">
          <div class="ribbon bg-primary">Popular</div>
          <div class="card-body text-center">
            <div class="subheader text-primary">Pro</div>
            <div class="display-5 fw-bold my-3">$29<small class="fs-4 text-secondary">/mo</small></div>
            <p class="text-secondary">For growing teams.</p>
            <ul class="list-unstyled text-start my-4">
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> Unlimited projects</li>
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> 10 GB storage</li>
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> Custom domain</li>
            </ul>
            <a href="{% url 'signup' %}?plan=pro" class="btn btn-primary w-100">Start free trial</a>
          </div>
        </div>
      </div>

      <!-- Enterprise -->
      <div class="col-md-4">
        <div class="card card-md h-100">
          <div class="card-body text-center">
            <div class="subheader">Enterprise</div>
            <div class="display-5 fw-bold my-3">Custom</div>
            <p class="text-secondary">For large organizations.</p>
            <ul class="list-unstyled text-start my-4">
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> SSO, audit logs</li>
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> Dedicated support</li>
              <li class="mb-2"><svg class="icon text-success me-1">...</svg> On-premise option</li>
            </ul>
            <a href="mailto:sales@example.com" class="btn btn-outline-primary w-100">Contact sales</a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
```

### Monthly / yearly toggle

```html
<div class="text-center mb-4">
  <div class="form-selectgroup d-inline-flex">
    <label class="form-selectgroup-item">
      <input type="radio" name="billing" value="monthly" class="form-selectgroup-input" checked>
      <span class="form-selectgroup-label">Monthly</span>
    </label>
    <label class="form-selectgroup-item">
      <input type="radio" name="billing" value="yearly" class="form-selectgroup-input">
      <span class="form-selectgroup-label">
        Yearly <span class="badge bg-success-lt ms-1">Save 20%</span>
      </span>
    </label>
  </div>
</div>

<script>
document.querySelectorAll('[name=billing]').forEach(r => {
  r.addEventListener('change', e => {
    const isYearly = e.target.value === 'yearly';
    document.querySelectorAll('[data-price-monthly]').forEach(el => {
      el.textContent = '$' + (isYearly ? el.dataset.priceYearly : el.dataset.priceMonthly);
    });
    document.querySelectorAll('[data-period]').forEach(el => {
      el.textContent = isYearly ? '/yr' : '/mo';
    });
  });
});
</script>
```

## Testimonials

```html
<section class="py-6 bg-body-tertiary">
  <div class="container-xl">
    <div class="text-center mb-5">
      <h2 class="display-6 fw-bold">Trusted by builders worldwide</h2>
    </div>
    <div class="row row-cards g-4">
      {% for t in testimonials %}
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="mb-3">
              {% for _ in '12345' %}
              <svg class="icon icon-sm text-warning">...</svg>
              {% endfor %}
            </div>
            <blockquote class="mb-0">"{{ t.quote }}"</blockquote>
          </div>
          <div class="card-footer d-flex align-items-center">
            <span class="avatar avatar-sm me-2 bg-primary-lt">{{ t.author|slice:":2"|upper }}</span>
            <div>
              <strong>{{ t.author }}</strong>
              <div class="text-secondary small">{{ t.role }}, {{ t.company }}</div>
            </div>
          </div>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>
```

## FAQ — accordion pattern

```html
<section class="py-6">
  <div class="container container-narrow">
    <div class="text-center mb-5">
      <h2 class="display-6 fw-bold">Frequently asked questions</h2>
    </div>
    <div class="accordion" id="faq">
      {% for q in faqs %}
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button{% if not forloop.first %} collapsed{% endif %}"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq-{{ forloop.counter }}">
            {{ q.question }}
          </button>
        </h2>
        <div id="faq-{{ forloop.counter }}"
             class="accordion-collapse collapse{% if forloop.first %} show{% endif %}"
             data-bs-parent="#faq">
          <div class="accordion-body text-secondary">{{ q.answer|linebreaks }}</div>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>
```

## Logo cloud / "trusted by"

```html
<section class="py-5">
  <div class="container-xl">
    <p class="text-center text-secondary subheader mb-4">Trusted by teams at</p>
    <div class="row align-items-center justify-content-center g-5">
      {% for logo in logos %}
      <div class="col-auto">
        <img src="{% static logo.path %}" alt="{{ logo.name }}"
             height="32" class="opacity-50 logo-grayscale">
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<style>
.logo-grayscale { filter: grayscale(1); transition: filter 200ms, opacity 200ms; }
.logo-grayscale:hover { filter: grayscale(0); opacity: 1 !important; }
</style>
```

## Newsletter signup

```html
<section class="py-6 bg-primary text-white">
  <div class="container container-tight text-center">
    <h2 class="display-6 fw-bold">Get product updates</h2>
    <p class="lead opacity-75">One email a month. No spam, ever.</p>
    <form class="row g-2 justify-content-center mt-4" hx-post="{% url 'newsletter:subscribe' %}" hx-swap="outerHTML">
      {% csrf_token %}
      <div class="col-auto">
        <input type="email" name="email" class="form-control" placeholder="you@example.com" required>
      </div>
      <div class="col-auto">
        <button class="btn btn-light" type="submit">Subscribe</button>
      </div>
    </form>
  </div>
</section>
```

## Call-to-action (CTA) banner

```html
<section class="py-5">
  <div class="container-xl">
    <div class="card card-md bg-primary text-white">
      <div class="card-body p-5">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h2 class="card-title text-white mb-2">Ready to ship faster?</h2>
            <p class="mb-0 opacity-75">Start your free 14-day trial. No credit card required.</p>
          </div>
          <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <a class="btn btn-light btn-lg">Start free trial</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## 404 / error pages

```html
{% extends "tabler/base.html" %}

{% block navbar %}{% endblock %}

{% block content %}
<div class="page page-center">
  <div class="container container-tight py-4">
    <div class="empty">
      <div class="empty-header">404</div>
      <p class="empty-title">Oops… You just found an error page</p>
      <p class="empty-subtitle text-secondary">
        We are sorry but the page you are looking for was not found.
      </p>
      <div class="empty-action">
        <a href="{% url 'website:home' %}" class="btn btn-primary">
          <svg class="icon me-1">...</svg> Take me home
        </a>
      </div>
    </div>
  </div>
</div>
{% endblock %}
```

`.page-center` vertically centers content; combined with empty `{% block navbar %}` removes the top bar for a clean error screen.

## Changelog / release notes

```html
<section class="py-5">
  <div class="container-xl">
    <div class="page-header">
      <h1 class="page-title">Changelog</h1>
      <p class="text-secondary">What's new in {{ brand.name }}.</p>
    </div>
    {% for release in releases %}
    <div class="card mb-4">
      <div class="card-body">
        <div class="d-flex align-items-center mb-3">
          <span class="badge bg-primary me-3">v{{ release.version }}</span>
          <small class="text-secondary">{{ release.date|date:"M d, Y" }}</small>
        </div>
        <div class="markdown">{{ release.body_html|safe }}</div>
      </div>
    </div>
    {% endfor %}
  </div>
</section>
```

Use `apps/website/templates/website/changelog.html` if present as a reference.

## Layout tips for marketing

- Use `.container-xl` for max-width with breathing room
- Use `.container container-tight` (narrow, ~640px) for single-column text-heavy sections (hero, newsletter, FAQ)
- Use `.container container-narrow` (slightly wider, ~960px) for medium-width content
- Sections are typically `py-6` (96px vertical padding) for marketing rhythm
- Use `bg-body-tertiary` for alternating section backgrounds (subtle striping)
- Use `display-*` classes for hero headings (3-6 work well for landing)
- Marketing pages benefit from the **boxed** layout (see [layouts.md](layouts.md)) but the default horizontal works fine

## Gotchas

- **The footer in `tabler/base.html` says "Built with SmallStack + Tabler"** — fine for technical/dev marketing pages, but you may want to override for fully customer-facing marketing. Override the `footer` (no such block exists by default — add one by editing the base template or making a marketing-specific base).
- **Marketing pages with no auth still get the navbar's user dropdown / login button** — that's correct behavior. For "landing pages with no nav" (lead-capture style), empty the `navbar` block.
- **Don't use `card-table` on marketing pages** — marketing tables (pricing, comparison) usually need `.table-borderless` and custom styling for visual distinctness.
- **Hero gradients can fight dark mode** — define explicit colors or use `var(--tblr-primary)` so the gradient tracks the user's accent setting.
- **Animation on scroll is not built in** — add [AOS](https://michalsnik.github.io/aos/) or [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) yourself if you want fade-in-on-scroll effects.

## Related skills

- [foundations.md](foundations.md) — the base structure
- [layouts.md](layouts.md) — choosing boxed vs default for marketing
- [components.md](components.md) — buttons, cards, ribbons used across landing
- [icons-typography.md](icons-typography.md) — display headings, type scale
- [forms.md](forms.md) — newsletter, contact form
- [page-content.md](page-content.md) — for blog/changelog content
