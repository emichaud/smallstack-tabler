// Moved from templates/website/home.html (inline <script>) so the CSP needs no 'unsafe-inline'.
document.addEventListener('DOMContentLoaded', function() {

    // ── Shared sparkline config ─────────────────────────
    function createSparkline(canvasId, data, color) {
        var ctx = document.getElementById(canvasId);
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: data.map(function(_, i) { return ''; }),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                elements: { line: { borderCapStyle: 'round' } }
            }
        });
    }

    // Sparkline data (placeholder)
    createSparkline('sparkline-users',   [12, 18, 14, 22, 19, 25, 28, 24, 30, 27, 33, 31, 35], '#f59f00');
    createSparkline('sparkline-sales',   [5, 8, 6, 12, 9, 15, 11, 18, 14, 20, 17, 22, 19],     '#2fb344');
    createSparkline('sparkline-revenue', [20, 25, 22, 30, 28, 35, 32, 40, 38, 42, 45, 48, 50], '#4299e1');
    createSparkline('sparkline-clients', [15, 12, 18, 14, 10, 16, 13, 9, 14, 11, 8, 12, 10],   '#d63939');
    createSparkline('sparkline-subs',    [8, 12, 10, 15, 18, 16, 20, 22, 19, 25, 23, 28, 30],  '#0ca678');

    // ── Donut/Gauge chart ───────────────────────────────
    var donutCtx = document.getElementById('donut-active');
    if (donutCtx) {
        new Chart(donutCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [76, 24],
                    backgroundColor: ['#f59f00', '#2c2e34'],
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
});
