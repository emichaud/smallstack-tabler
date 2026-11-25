// Moved from apps/preview/templates/preview/charts.html (inline <script>) so the CSP needs no 'unsafe-inline'.
document.addEventListener('DOMContentLoaded', function() {
    var labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var gridColor = '#2c2e34';
    var textColor = '#656d77';

    Chart.defaults.color = textColor;
    Chart.defaults.borderColor = gridColor;

    new Chart(document.getElementById('chart-line'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: [18,22,28,25,32,30,38,35,42,40,48,52],
                borderColor: '#f59f00',
                backgroundColor: 'rgba(245,159,0,0.1)',
                fill: true, tension: 0.3, pointRadius: 3
            },{
                label: 'Expenses',
                data: [12,15,14,18,16,20,22,19,24,22,26,28],
                borderColor: '#4299e1',
                backgroundColor: 'rgba(66,153,225,0.1)',
                fill: true, tension: 0.3, pointRadius: 3
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' }}}
    });

    new Chart(document.getElementById('chart-bar'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales',
                data: [42,55,38,62,48,70,58,75,65,80,72,90],
                backgroundColor: '#f59f00'
            },{
                label: 'Returns',
                data: [5,8,6,10,7,12,9,14,11,15,13,8],
                backgroundColor: '#d63939'
            }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' }}}
    });

    new Chart(document.getElementById('chart-doughnut'), {
        type: 'doughnut',
        data: {
            labels: ['Desktop','Mobile','Tablet'],
            datasets: [{ data: [55,30,15], backgroundColor: ['#f59f00','#4299e1','#2fb344'], borderWidth: 0 }]
        },
        options: { responsive: false, plugins: { legend: { position: 'bottom' }}, cutout: '65%' }
    });

    new Chart(document.getElementById('chart-polar'), {
        type: 'polarArea',
        data: {
            labels: ['CSS','HTML','JS','Python','PHP'],
            datasets: [{ data: [14,11,16,8,12], backgroundColor: ['#f59f00','#4299e1','#2fb344','#d63939','#ae3ec9'], borderWidth: 0 }]
        },
        options: { responsive: false, plugins: { legend: { position: 'bottom' }}}
    });

    new Chart(document.getElementById('chart-radar'), {
        type: 'radar',
        data: {
            labels: ['Speed','Reliability','Comfort','Safety','Efficiency'],
            datasets: [{
                label: 'Product A',
                data: [65,75,70,80,60],
                borderColor: '#f59f00', backgroundColor: 'rgba(245,159,0,0.2)'
            },{
                label: 'Product B',
                data: [80,60,85,55,75],
                borderColor: '#4299e1', backgroundColor: 'rgba(66,153,225,0.2)'
            }]
        },
        options: { responsive: false, plugins: { legend: { position: 'bottom' }}}
    });
});
