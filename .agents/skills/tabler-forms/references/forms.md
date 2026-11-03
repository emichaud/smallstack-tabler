# Forms — basic to advanced (Flatpickr, Choices.js, Imask, Dropzone, …)

**Use this skill when** building any form: signup, settings, content editing, multi-step wizards, advanced selects, date pickers, file uploads, masked inputs, signature capture, star ratings, range sliders.

## Tabler references

- Docs: https://docs.tabler.io/ui/components/forms
- Preview: https://preview.tabler.io/form-elements.html
- Preview: https://preview.tabler.io/form-validation.html
- Preview: https://preview.tabler.io/form-wizard.html

## In-repo examples

- `apps/tabler/templates/smallstack/crud/object_form.html` — the canonical CRUD form
- `apps/tabler/templates/smallstack/crud/_form_styles.html` — shared form CSS overrides
- `apps/tabler/templates/registration/login.html` — auth form
- `apps/tabler/templates/profile/profile_edit.html` — settings form
- `apps/smallstack/templatetags/crud_tags.py` — `{% crud_form %}` tag

## Basic form structure

```html
<div class="card">
  <div class="card-header"><h3 class="card-title">Settings</h3></div>
  <div class="card-body">
    <form method="post">
      {% csrf_token %}

      <div class="mb-3">
        <label class="form-label required">Name</label>
        <input type="text" class="form-control" name="name" required>
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" name="email" placeholder="you@example.com">
        <small class="form-hint">We'll never share your email.</small>
      </div>

      <div class="mb-3">
        <label class="form-label">Role</label>
        <select class="form-select" name="role">
          <option>Admin</option>
          <option>User</option>
        </select>
      </div>
    </form>
  </div>
  <div class="card-footer text-end">
    <button type="submit" class="btn btn-primary">Save</button>
  </div>
</div>
```

### Field structure conventions

- `.form-label` for label; add `.required` for the asterisk
- `.form-control` for inputs; `.form-select` for `<select>`
- `.form-hint` for help text
- `.invalid-feedback.d-block` for errors
- `.mb-3` between fields for vertical spacing

## All input types

```html
<!-- Text -->
<input type="text" class="form-control" placeholder="Text">

<!-- Email, URL, Tel, Password, Number, Search -->
<input type="email" class="form-control">
<input type="url" class="form-control">
<input type="tel" class="form-control">
<input type="password" class="form-control">
<input type="number" class="form-control">
<input type="search" class="form-control">

<!-- Textarea -->
<textarea class="form-control" rows="4"></textarea>

<!-- Select -->
<select class="form-select">
  <option>Option 1</option>
</select>

<!-- Multi-select (native) -->
<select class="form-select" multiple>...</select>

<!-- Date / time (native — replace with Flatpickr for nicer UI) -->
<input type="date" class="form-control">
<input type="datetime-local" class="form-control">

<!-- Color -->
<input type="color" class="form-control form-control-color">

<!-- File -->
<input type="file" class="form-control">

<!-- Range -->
<input type="range" class="form-range" min="0" max="100">
```

### Sizing
`.form-control-sm` `.form-control` (default) `.form-control-lg`

### Variants
- `.form-control-flush` — borderless
- `.form-control-rounded` — fully rounded
- `.form-control-dark` — dark variant
- `.form-control-light` — light variant

## Input groups (prefix/suffix)

```html
<!-- Text addon -->
<div class="input-group">
  <span class="input-group-text">https://</span>
  <input type="text" class="form-control" placeholder="example.com">
  <span class="input-group-text">.com</span>
</div>

<!-- Icon addon -->
<div class="input-icon">
  <span class="input-icon-addon">
    <svg class="icon">...</svg>
  </span>
  <input type="text" class="form-control" placeholder="Search...">
</div>

<!-- Right-side icon -->
<div class="input-icon">
  <input type="text" class="form-control" placeholder="Search...">
  <span class="input-icon-addon">
    <svg class="icon">...</svg>
  </span>
</div>

<!-- Button addon -->
<div class="input-group">
  <input type="text" class="form-control">
  <button class="btn btn-primary">Apply</button>
</div>
```

## Checkboxes & switches

```html
<!-- Checkbox -->
<label class="form-check">
  <input class="form-check-input" type="checkbox">
  <span class="form-check-label">I agree</span>
</label>

<!-- Switch (toggle) -->
<label class="form-check form-switch">
  <input class="form-check-input" type="checkbox" checked>
  <span class="form-check-label">Notifications</span>
</label>

<!-- Switch description -->
<label class="form-check form-switch">
  <input class="form-check-input" type="checkbox">
  <span class="form-check-label">Newsletter</span>
  <span class="form-check-description">Subscribe to product updates.</span>
</label>

<!-- Radio -->
<label class="form-check">
  <input class="form-check-input" type="radio" name="role" value="admin">
  <span class="form-check-label">Admin</span>
</label>
```

## Select group (radio-as-buttons)

```html
<div class="form-selectgroup">
  <label class="form-selectgroup-item">
    <input type="radio" name="plan" value="free" class="form-selectgroup-input" checked>
    <span class="form-selectgroup-label">Free</span>
  </label>
  <label class="form-selectgroup-item">
    <input type="radio" name="plan" value="pro" class="form-selectgroup-input">
    <span class="form-selectgroup-label">Pro</span>
  </label>
</div>

<!-- Card-style select group -->
<div class="row g-2">
  <div class="col-sm-6">
    <label class="form-selectgroup-item">
      <input type="radio" name="size" value="sm" class="form-selectgroup-input" checked>
      <span class="form-selectgroup-label">
        <strong>Small</strong>
        <p class="text-secondary mb-0">Up to 10 users</p>
      </span>
    </label>
  </div>
  ...
</div>
```

## Color input

```html
<label class="form-colorinput">
  <input name="color" type="radio" value="red" class="form-colorinput-input">
  <span class="form-colorinput-color" style="background-color: #d63939;"></span>
</label>
```

Used in the settings panel for color-scheme picker — see `tabler/includes/settings.html`.

## Validation states

```html
<!-- Valid -->
<div class="mb-3">
  <input type="text" class="form-control is-valid" value="OK">
  <div class="valid-feedback">Looks good!</div>
</div>

<!-- Invalid -->
<div class="mb-3">
  <input type="text" class="form-control is-invalid" value="">
  <div class="invalid-feedback">This field is required.</div>
</div>
```

For Django forms, the CRUD framework already wires up errors — see [tables.md](tables.md) for `{% crud_form %}`.

## Advanced inputs (Tabler-bundled plugins)

Tabler bundles many input enhancement libraries. Each loads on demand — drop in the HTML + init JS.

### Flatpickr — date / datetime / time picker

```html
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
{% endblock %}

<input type="text" class="form-control flatpickr-input" placeholder="Pick a date">

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
flatpickr('.flatpickr-input', {
  dateFormat: 'Y-m-d',
  allowInput: true
});
</script>
{% endblock %}
```

**Variants**:

```js
// Date range
flatpickr('.flatpickr-range', { mode: 'range', dateFormat: 'Y-m-d' });

// Datetime
flatpickr('.flatpickr-datetime', { enableTime: true, dateFormat: 'Y-m-d H:i' });

// Time only
flatpickr('.flatpickr-time', { enableTime: true, noCalendar: true, dateFormat: 'H:i' });

// Multiple dates
flatpickr('.flatpickr-multi', { mode: 'multiple', dateFormat: 'Y-m-d' });

// Inline (no popup)
flatpickr('.flatpickr-inline', { inline: true });

// With min/max
flatpickr('input.bookable', {
  minDate: 'today',
  maxDate: new Date().fp_incr(90)
});
```

**Theme-aware Flatpickr**: For dark mode polish:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/dark.css">
<!-- Or only on dark: -->
<style>
body.theme-dark .flatpickr-calendar { background: var(--tblr-card-bg); color: var(--tblr-body-color); }
body.theme-dark .flatpickr-day.selected { background: var(--tblr-primary); }
</style>
```

### Choices.js — searchable select / tag input

```html
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
{% endblock %}

<select class="form-select" id="choices-select" multiple>
  <option value="js">JavaScript</option>
  <option value="py">Python</option>
  <option value="go">Go</option>
</select>

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
<script>
new Choices('#choices-select', {
  removeItemButton: true,
  searchEnabled: true,
});
</script>
{% endblock %}
```

**Tag input**:
```html
<input type="text" id="choices-tags" placeholder="Add tags...">
<script>
new Choices('#choices-tags', {
  delimiter: ',',
  editItems: true,
  duplicateItemsAllowed: false,
});
</script>
```

### tom-select — alternative searchable select

Tom Select is more flexible than Choices for remote-search and templating:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tom-select/dist/css/tom-select.bootstrap5.min.css">
<select id="ts-select" placeholder="Pick a user..."></select>

<script src="https://cdn.jsdelivr.net/npm/tom-select/dist/js/tom-select.complete.min.js"></script>
<script>
new TomSelect('#ts-select', {
  valueField: 'id',
  labelField: 'name',
  searchField: 'name',
  load: function(query, callback) {
    fetch(`/api/users/search/?q=${query}`)
      .then(r => r.json())
      .then(callback)
      .catch(() => callback());
  }
});
</script>
```

Pairs well with SmallStack's CRUD JSON API. See [page-api-explorer.md](page-api-explorer.md).

### Imask — masked input

For phone numbers, credit cards, currencies, dates with strict formats:

```html
<input type="text" class="form-control" id="mask-phone" placeholder="(___) ___-____">

<script src="https://cdn.jsdelivr.net/npm/imask"></script>
<script>
IMask(document.getElementById('mask-phone'), {
  mask: '(000) 000-0000'
});

// Credit card
IMask(document.getElementById('mask-cc'), {
  mask: '0000 0000 0000 0000'
});

// Currency
IMask(document.getElementById('mask-money'), {
  mask: '$num',
  blocks: { num: { mask: Number, thousandsSeparator: ',' } }
});

// Date
IMask(document.getElementById('mask-date'), {
  mask: Date,
  pattern: 'd{/}`m{/}`Y'
});
</script>
```

### Dropzone — drag-drop file upload

```html
{% block extra_css %}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dropzone@6/dist/dropzone.css">
{% endblock %}

<form action="{% url 'myapp:upload' %}" class="dropzone" id="my-dropzone">
  {% csrf_token %}
  <div class="fallback">
    <input name="file" type="file" />
  </div>
</form>

{% block extra_js %}
<script src="https://cdn.jsdelivr.net/npm/dropzone@6/dist/dropzone-min.js"></script>
<script>
Dropzone.options.myDropzone = {
  paramName: 'file',
  maxFilesize: 10,    // MB
  acceptedFiles: 'image/*,.pdf',
  addRemoveLinks: true,
  headers: {
    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
  }
};
</script>
{% endblock %}
```

Django view receives uploads as `request.FILES['file']`.

### Signature Pad — capture signatures

```html
<canvas id="signature-pad" class="border rounded w-100" style="height: 200px;"></canvas>
<button class="btn btn-link" id="sig-clear">Clear</button>
<input type="hidden" name="signature_data" id="signature_data">

<script src="https://cdn.jsdelivr.net/npm/signature_pad@5"></script>
<script>
const pad = new SignaturePad(document.getElementById('signature-pad'));
document.getElementById('sig-clear').addEventListener('click', () => pad.clear());

// On form submit, serialize to base64
document.querySelector('form').addEventListener('submit', () => {
  if (!pad.isEmpty()) document.getElementById('signature_data').value = pad.toDataURL();
});
</script>
```

### Star Rating

```html
<select id="rating">
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3" selected>3</option>
  <option value="4">4</option>
  <option value="5">5</option>
</select>

<script src="https://cdn.jsdelivr.net/npm/star-rating.js@4"></script>
<script>
new StarRating('#rating', { showText: false });
</script>
```

### NoUiSlider — range sliders

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/nouislider/dist/nouislider.min.css">
<div id="price-range"></div>
<div class="d-flex justify-content-between mt-2">
  <span id="price-min">$0</span>
  <span id="price-max">$1000</span>
</div>

<script src="https://cdn.jsdelivr.net/npm/nouislider/dist/nouislider.min.js"></script>
<script>
const slider = document.getElementById('price-range');
noUiSlider.create(slider, {
  start: [200, 800],
  connect: true,
  range: { min: 0, max: 1000 }
});

slider.noUiSlider.on('update', (values) => {
  document.getElementById('price-min').textContent = '$' + Math.round(values[0]);
  document.getElementById('price-max').textContent = '$' + Math.round(values[1]);
});
</script>
```

Style under dark mode:
```css
body.theme-dark .noUi-target { background: var(--tblr-card-bg); border-color: var(--tblr-border-color); }
body.theme-dark .noUi-connect { background: var(--tblr-primary); }
```

### Autosize textarea

```html
<textarea class="form-control" id="bio" rows="3"></textarea>

<script>
const ta = document.getElementById('bio');
ta.style.overflow = 'hidden';
function autoSize() {
  ta.style.height = 'auto';
  ta.style.height = ta.scrollHeight + 'px';
}
ta.addEventListener('input', autoSize);
autoSize();
</script>
```

## Form layouts

### Horizontal (label beside input)

```html
<div class="mb-3 row">
  <label class="col-3 col-form-label">Name</label>
  <div class="col">
    <input type="text" class="form-control">
  </div>
</div>
```

### Inline (all fields one row)

```html
<form class="row g-3 align-items-center">
  <div class="col-auto">
    <label class="visually-hidden">Email</label>
    <input type="email" class="form-control" placeholder="Email">
  </div>
  <div class="col-auto">
    <button type="submit" class="btn btn-primary">Subscribe</button>
  </div>
</form>
```

### Multi-column

```html
<div class="row">
  <div class="col-md-6 mb-3">
    <label class="form-label">First name</label>
    <input type="text" class="form-control">
  </div>
  <div class="col-md-6 mb-3">
    <label class="form-label">Last name</label>
    <input type="text" class="form-control">
  </div>
</div>
```

## Multi-step wizard

Use Tabler's `.steps` component plus tab panes:

```html
<div class="card">
  <div class="card-body">
    <div class="steps steps-counter steps-green" data-progress="1" id="wiz-steps">
      <span class="step-item active">Account</span>
      <span class="step-item">Profile</span>
      <span class="step-item">Plan</span>
      <span class="step-item">Confirm</span>
    </div>
  </div>

  <div class="card-body">
    <div class="tab-content" id="wiz-content">
      <div class="tab-pane fade show active" id="wiz-1">Account fields</div>
      <div class="tab-pane fade" id="wiz-2">Profile fields</div>
      <div class="tab-pane fade" id="wiz-3">Plan fields</div>
      <div class="tab-pane fade" id="wiz-4">Confirmation</div>
    </div>
  </div>

  <div class="card-footer d-flex justify-content-between">
    <button class="btn btn-link" id="wiz-back" disabled>Back</button>
    <button class="btn btn-primary" id="wiz-next">Next</button>
  </div>
</div>

<script>
let step = 1;
const total = 4;
const next = document.getElementById('wiz-next');
const back = document.getElementById('wiz-back');
const stepsEl = document.getElementById('wiz-steps');

function show(n) {
  document.querySelectorAll('#wiz-content .tab-pane').forEach((p, i) => {
    p.classList.toggle('active', i + 1 === n);
    p.classList.toggle('show', i + 1 === n);
  });
  stepsEl.querySelectorAll('.step-item').forEach((s, i) => {
    s.classList.toggle('active', i + 1 <= n);
  });
  stepsEl.dataset.progress = n;
  back.disabled = n === 1;
  next.textContent = n === total ? 'Finish' : 'Next';
}

next.addEventListener('click', () => {
  if (step < total) { step++; show(step); }
  else document.querySelector('form').submit();
});
back.addEventListener('click', () => { if (step > 1) { step--; show(step); } });
</script>
```

For server-side wizard with state preserved across pages, use [django-formtools' `FormWizardView`](https://django-formtools.readthedocs.io/) and render each step into the active tab pane.

## Django form integration

### Basic Django form rendering

```django
<form method="post">
  {% csrf_token %}
  {% for field in form %}
    <div class="mb-3">
      <label class="form-label {% if field.field.required %}required{% endif %}">
        {{ field.label }}
      </label>
      {{ field }}
      {% if field.help_text %}<small class="form-hint">{{ field.help_text }}</small>{% endif %}
      {% if field.errors %}<div class="invalid-feedback d-block">{{ field.errors.0 }}</div>{% endif %}
    </div>
  {% endfor %}
  <button type="submit" class="btn btn-primary">Save</button>
</form>
```

For automatic class application, use SmallStack's `vTextField` widget class — see `apps/smallstack/forms.py` or override the widget in the form `__init__`:

```python
class MyForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for f in self.fields.values():
            f.widget.attrs.setdefault('class', 'form-control')
        # SelectField → form-select
        for name, f in self.fields.items():
            if isinstance(f.widget, forms.Select):
                f.widget.attrs['class'] = 'form-select'
```

### Using the `{% crud_form %}` tag

For CRUD forms in views built on SmallStack's CRUDView, the entire form renders with one tag:

```django
{% load crud_tags %}
{% crud_form %}
```

See `apps/smallstack/templatetags/crud_tags.py` and the example `apps/tabler/templates/smallstack/crud/object_form.html`.

## htmx form submission

Inline validate + submit without a page reload:

```html
<form hx-post="{% url 'myapp:save' %}"
      hx-target="#form-container"
      hx-swap="outerHTML">
  {% csrf_token %}
  {% include 'myapp/form_body.html' %}
  <button class="btn btn-primary">Save</button>
</form>
```

Server returns the same form with `is_invalid` classes on bad fields, or a success card. See [htmx-patterns.md](htmx-patterns.md) for the full pattern.

## Gotchas

- **Flatpickr binds to the wrapped input.** If you call `flatpickr('#date')` twice, the second call attaches another picker without cleaning up the first. Track instances and `destroy()` before re-binding.
- **Choices.js wraps the original select** in a custom div. To re-init after htmx swap, locate via the wrapper class `.choices` and reset.
- **Tom Select with remote `load`** doesn't cache by default — adds latency. Add `loadThrottle: 300` and consider client-side caching.
- **Imask attaches to the existing input.** Don't replace the input's value via `.value = ...` after mask is bound — use `mask.value = "..."` instead.
- **Dropzone v6 requires a form** — `.dropzone` on a `<div>` won't auto-init.
- **Star Rating modifies the DOM** — wrap before any code that queries the original `<select>`.
- **Signature Pad canvas resize** requires `pad.fromData(pad.toData())` after canvas dimension change — otherwise existing strokes warp.
- **Switch (`.form-switch`)** is just a styled checkbox — Django renders it as a regular checkbox. Add the class via widget attrs.
- **Color input picker** requires `type="color"` AND `.form-control-color` — without the latter, the swatch is full width.

## Related skills

- [tables.md](tables.md) — for forms inside table rows (inline edit)
- [page-utility.md](page-utility.md) — for kanban/calendar editors using these forms
- [htmx-patterns.md](htmx-patterns.md) — for inline-validation patterns
- [components.md](components.md) — for buttons, alerts, status badges used around forms
