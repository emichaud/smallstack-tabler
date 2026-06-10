# Page recipe — auth screens (login, signup, lock, password reset)

**Use this skill when** building or customizing login, signup, lock-screen, password-reset, MFA, or email-confirmation pages.

## Tabler references

- Preview: https://preview.tabler.io/sign-in.html
- Preview: https://preview.tabler.io/sign-up.html
- Preview: https://preview.tabler.io/forgot-password.html
- Preview: https://preview.tabler.io/lock.html

## In-repo files

- `apps/tabler/templates/registration/tabler_auth_base.html` — auth scaffold (centered card on dark page)
- `apps/tabler/templates/registration/login.html` — login form
- `apps/tabler/templates/registration/signup.html` — signup form
- `apps/tabler/templates/registration/password_reset_form.html` — request-reset
- `apps/tabler/templates/registration/password_reset_done.html` — "check your email"
- `apps/tabler/templates/registration/password_reset_confirm.html` — set new password
- `apps/tabler/templates/registration/password_reset_complete.html` — done
- `apps/tabler/templates/registration/logged_out.html` — logged out

## The auth base template

`apps/tabler/templates/registration/tabler_auth_base.html` is a **separate base from `tabler/base.html`** — it intentionally:
- Has no navbar (no `{% block navbar %}`)
- Centers the auth card vertically (`page page-center`)
- Wraps content in `<div class="card card-md">`
- Loads Tabler CSS + the theme blocker but skips HTMX, the theme engine, and the settings panel
- Defines a `card-md`-width content area (~480px)

Extend it for any auth screen:

```django
{% extends "registration/tabler_auth_base.html" %}

{% block title %}Sign in{% endblock %}

{% block auth_content %}
<h2 class="h2 text-center mb-4">Sign in</h2>
<form method="post">
  {% csrf_token %}
  <div class="mb-3">
    <label class="form-label">Email</label>
    <input type="email" name="username" class="form-control" autofocus required>
  </div>
  <div class="mb-3">
    <label class="form-label">
      Password
      <span class="form-label-description">
        <a href="{% url 'password_reset' %}">Forgot?</a>
      </span>
    </label>
    <input type="password" name="password" class="form-control" required>
  </div>
  <div class="mb-3">
    <label class="form-check">
      <input type="checkbox" name="remember" class="form-check-input">
      <span class="form-check-label">Remember me</span>
    </label>
  </div>
  {% if form.errors %}
  <div class="alert alert-danger">{{ form.non_field_errors|default:"Invalid email or password" }}</div>
  {% endif %}
  <div class="form-footer">
    <button type="submit" class="btn btn-primary w-100">Sign in</button>
  </div>
</form>
{% endblock %}

{% block auth_footer %}
<div class="text-center text-secondary mt-3">
  Don't have an account yet? <a href="{% url 'signup' %}">Sign up</a>
</div>
{% endblock %}
```

The base provides `auth_content` (card body) and `auth_footer` (below the card) blocks.

## Signup variant

```django
{% extends "registration/tabler_auth_base.html" %}

{% block title %}Sign up{% endblock %}

{% block auth_content %}
<h2 class="h2 text-center mb-4">Create new account</h2>
<form method="post">
  {% csrf_token %}
  <div class="mb-3">
    <label class="form-label">Name</label>
    <input type="text" name="name" class="form-control" placeholder="Your name">
  </div>
  <div class="mb-3">
    <label class="form-label">Email address</label>
    <input type="email" name="email" class="form-control" required>
  </div>
  <div class="mb-3">
    <label class="form-label">Password</label>
    <input type="password" name="password1" class="form-control" required>
    <small class="form-hint">At least 8 characters.</small>
  </div>
  <div class="mb-3">
    <label class="form-check">
      <input type="checkbox" name="agree" class="form-check-input" required>
      <span class="form-check-label">
        Agree to <a href="{{ brand.terms_url }}">terms and policy</a>
      </span>
    </label>
  </div>
  <div class="form-footer">
    <button type="submit" class="btn btn-primary w-100">Create new account</button>
  </div>
</form>
{% endblock %}

{% block auth_footer %}
<div class="text-center text-secondary mt-3">
  Already have an account? <a href="{% url 'login' %}">Sign in</a>
</div>
{% endblock %}
```

## Password reset flow

### 1. Request reset

```django
{% block auth_content %}
<h2 class="h2 text-center mb-4">Forgot password</h2>
<p class="text-secondary mb-4">
  Enter your email and we'll send you instructions to reset your password.
</p>
<form method="post">
  {% csrf_token %}
  <div class="mb-3">
    <label class="form-label">Email address</label>
    <input type="email" name="email" class="form-control" required autofocus>
  </div>
  <div class="form-footer">
    <button class="btn btn-primary w-100">Send instructions</button>
  </div>
</form>
{% endblock %}

{% block auth_footer %}
<div class="text-center text-secondary mt-3">
  Remembered? <a href="{% url 'login' %}">Sign in</a>
</div>
{% endblock %}
```

### 2. Email-sent confirmation

```django
{% block auth_content %}
<div class="text-center">
  <svg class="icon icon-xl text-success mb-3">...</svg>
  <h2 class="h2 mb-2">Check your email</h2>
  <p class="text-secondary">
    We sent password reset instructions to your email address.
    The link will expire in 1 hour.
  </p>
</div>
{% endblock %}
```

### 3. Set new password

```django
{% block auth_content %}
<h2 class="h2 text-center mb-4">Set new password</h2>
{% if validlink %}
<form method="post">
  {% csrf_token %}
  <div class="mb-3">
    <label class="form-label">New password</label>
    <input type="password" name="new_password1" class="form-control" required>
  </div>
  <div class="mb-3">
    <label class="form-label">Confirm</label>
    <input type="password" name="new_password2" class="form-control" required>
  </div>
  <div class="form-footer">
    <button class="btn btn-primary w-100">Reset password</button>
  </div>
</form>
{% else %}
<div class="alert alert-danger">
  This link is invalid or has expired. <a href="{% url 'password_reset' %}">Request a new one.</a>
</div>
{% endif %}
{% endblock %}
```

## Lock screen

When a session is paused (idle timeout), redirect to lock screen rather than login:

```django
{% extends "registration/tabler_auth_base.html" %}

{% block auth_content %}
<div class="text-center mb-4">
  <span class="avatar avatar-xl bg-primary-lt">
    {{ user.username|slice:":2"|upper }}
  </span>
  <h2 class="h2 mt-3">{{ user.get_full_name|default:user.username }}</h2>
  <p class="text-secondary">Enter your password to continue</p>
</div>
<form method="post">
  {% csrf_token %}
  <div class="mb-3">
    <input type="password" name="password" class="form-control" placeholder="Password" required autofocus>
  </div>
  <div class="form-footer">
    <button class="btn btn-primary w-100">Unlock</button>
  </div>
</form>
{% endblock %}

{% block auth_footer %}
<div class="text-center text-secondary mt-3">
  Not you? <a href="{% url 'logout' %}?next={% url 'login' %}">Sign out</a>
</div>
{% endblock %}
```

## Email confirmation / verification

```django
{% block auth_content %}
<div class="text-center">
  <svg class="icon icon-xl text-warning mb-3">...</svg>
  <h2 class="h2 mb-2">Verify your email</h2>
  <p class="text-secondary mb-4">
    We sent a verification link to <strong>{{ email }}</strong>.
    Click it to activate your account.
  </p>
  <form method="post" action="{% url 'resend_verification' %}">
    {% csrf_token %}
    <button class="btn btn-link btn-sm">Resend verification email</button>
  </form>
</div>
{% endblock %}
```

## OAuth / SSO buttons

Add provider buttons above the form:

```html
<div class="mb-3">
  <a href="{% url 'social:begin' 'google-oauth2' %}" class="btn w-100">
    <svg class="icon me-2">...</svg>
    Continue with Google
  </a>
</div>
<div class="mb-3">
  <a href="{% url 'social:begin' 'github' %}" class="btn w-100">
    <svg class="icon me-2">...</svg>
    Continue with GitHub
  </a>
</div>
<div class="hr-text">or</div>
<form method="post">
  ...
</form>

<style>
.hr-text { display: flex; align-items: center; text-align: center; color: var(--tblr-muted); margin: 1rem 0; }
.hr-text::before, .hr-text::after { content: ''; flex: 1; border-top: 1px solid var(--tblr-border-color); }
.hr-text::before { margin-right: 0.75em; }
.hr-text::after { margin-left: 0.75em; }
</style>
```

## Two-factor (MFA) screen

```django
{% block auth_content %}
<h2 class="h2 text-center mb-4">Two-factor authentication</h2>
<p class="text-center text-secondary mb-4">
  Enter the 6-digit code from your authenticator app.
</p>
<form method="post">
  {% csrf_token %}
  <div class="mb-3 d-flex gap-2 justify-content-center">
    <input type="text" maxlength="1" class="form-control form-control-lg text-center otp-digit" inputmode="numeric" style="width: 48px;">
    <input type="text" maxlength="1" class="form-control form-control-lg text-center otp-digit" inputmode="numeric" style="width: 48px;">
    <input type="text" maxlength="1" class="form-control form-control-lg text-center otp-digit" inputmode="numeric" style="width: 48px;">
    <input type="text" maxlength="1" class="form-control form-control-lg text-center otp-digit" inputmode="numeric" style="width: 48px;">
    <input type="text" maxlength="1" class="form-control form-control-lg text-center otp-digit" inputmode="numeric" style="width: 48px;">
    <input type="text" maxlength="1" class="form-control form-control-lg text-center otp-digit" inputmode="numeric" style="width: 48px;">
  </div>
  <input type="hidden" name="otp" id="otp-combined">
  <div class="form-footer">
    <button class="btn btn-primary w-100">Verify</button>
  </div>
</form>

<script>
const digits = [...document.querySelectorAll('.otp-digit')];
const combined = document.getElementById('otp-combined');
digits.forEach((d, i) => {
  d.addEventListener('input', () => {
    if (d.value && i < digits.length - 1) digits[i + 1].focus();
    combined.value = digits.map(x => x.value).join('');
  });
  d.addEventListener('keydown', e => {
    if (e.key === 'Backspace' && !d.value && i > 0) digits[i - 1].focus();
  });
});
</script>
{% endblock %}
```

## Logged-out / sign-in confirmation

```django
{% block auth_content %}
<div class="text-center">
  <svg class="icon icon-xl text-success mb-3">...</svg>
  <h2 class="h2 mb-2">You've been signed out</h2>
  <p class="text-secondary mb-4">Thanks for using {{ brand.name }}.</p>
  <a href="{% url 'login' %}" class="btn btn-primary">Sign in again</a>
</div>
{% endblock %}
```

## Theme + auth pages

The auth base loads the theme blocker but **not** the theme engine. The card respects `body.theme-dark` for dark mode automatically. Users who set their theme stay in their preferred mode on auth pages.

Some links in auth pages use a custom muted color (see `tabler_auth_base.html` lines 28-33):

```css
a { color: #a0a4ab; }
a:hover { color: #ffffff; }
```

You can override per-page with inline `<style>` if needed.

## SmallStack signup gate

`SMALLSTACK_SIGNUP_ENABLED` (in settings) controls whether signup is allowed. The signup template should check:

```django
{% if not smallstack_signup_enabled %}
<div class="alert alert-info">
  Signup is currently disabled. <a href="{% url 'login' %}">Sign in</a> instead.
</div>
{% else %}
<form>...</form>
{% endif %}
```

See [../authentication.md](../authentication.md).

## Branding

The auth header shows `{{ brand.name }}` and the logo from the navbar. To customize:

```django
{% block auth_content %}
<div class="text-center mb-4">
  <img src="{% static brand.logo %}" alt="{{ brand.name }}" style="height: 48px;">
</div>
<h2 class="h2 text-center mb-4">Welcome back to {{ brand.name }}</h2>
{# form ... #}
{% endblock %}
```

## Gotchas

- **Auth pages use a different base** (`tabler_auth_base.html`, not `tabler/base.html`) — don't mistakenly extend the wrong one or you'll get the navbar on login.
- **The auth base has NO htmx loaded** — htmx form submissions won't work. Either load htmx in your auth template, or use traditional form submission (recommended for security-sensitive pages).
- **CSRF still required** even though the page looks like a marketing form — `{% csrf_token %}` inside every `<form>`.
- **Django's auth view uses `username` field name even for email-as-username setups** — your form needs `name="username"` not `name="email"` to work with `LoginView`.
- **Password reset emails are sent by Django's `PasswordResetView`** — configure `EMAIL_BACKEND`, `DEFAULT_FROM_EMAIL`, etc. in settings.
- **`autofocus` should be on the first form field** for accessibility.
- **OTP inputs need `inputmode="numeric"`** to get the number pad on mobile keyboards.
- **Auth pages with no navbar** lose the user-menu logout — use the URL `{% url 'logout' %}` form-POST anywhere you offer "sign out" links.
- **OAuth callbacks require allowed redirect URLs** to be configured per-provider; don't forget to whitelist `https://yourdomain.com/auth/callback/`.

## Related skills

- [foundations.md](foundations.md) — for the main page architecture (different from auth)
- [theming.md](theming.md) — dark mode applies to auth pages too
- [forms.md](forms.md) — for form patterns
- [components.md](components.md) — for cards, alerts, status icons
- [../authentication.md](../authentication.md) — SmallStack's auth model + views
