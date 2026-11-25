// Moved from apps/tabler/templates/smallstack/crud/object_form.html (inline <script>) so the CSP needs no 'unsafe-inline'.
// Wrap date/datetime-local/time inputs with a picker button
document.querySelectorAll('form input[type="date"], form input[type="datetime-local"], form input[type="time"]').forEach(function(input) {
    // Add Tabler form-control class if not present
    if (!input.classList.contains('form-control')) input.classList.add('form-control');
    input.style.cursor = 'pointer';
    input.addEventListener('click', function() {
        if (this.showPicker) this.showPicker();
    });
});
