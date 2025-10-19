// --- Configuration ---
const METRIC_COLUMNS = {
    'undernourishment_rate(%)': { label: 'Prevalence of Undernourishment (%)', format: val => `${val.toFixed(1)}%` },
    'Global Hunger Index (2021)': { label: 'Global Hunger Index Score', format: val => val.toFixed(1) },
    'calorie_supply_per_person(kcal/person/day)': { label: 'Daily Calorie Supply (kcal)', format: val => `${val.toFixed(0)} kcal` },
    'stunting_rate(%)': { label: 'Child Stunting Rate (%)', format: val => `${val.toFixed(1)}%` },
    'agri_employment_share(%)': { label: 'Agricultural Employment Share (%)', format: val => `${val.toFixed(1)}%` }
};
// Updated Electric/Neon colors for high contrast on black background
const COLORS = { 
    PRIMARY: '#00FFFF', // Electric Cyan
    PRIMARY_BG: 'rgba(0, 255, 255, 0.15)', 
    COMPARE: '#FF00FF', // Electric Magenta
    COMPARE_BG: 'rgba(255, 0, 255, 0.15)' 
};

let dpedaData = [];
const ctx = document.getElementById("chart").getContext("2d");
const chartContainer = document.querySelector(".chart-container");
let myChart;


// --- Utility: Simple CSV Parser ---
function parseCSV(text) {
    const [headerLine, ...dataLines] = text.trim().split('\n');
    if (!headerLine) return [];
    
    const headers = headerLine.split(',').map(h => h.trim().replace(/"/g, ''));
    
    return dataLines.map(line => {
        const values = [];
        let current_value = '';
        let in_quotes = false;
        for(const char of line) {
            if (char === '"') in_quotes = !in_quotes;
            else if (char === ',' && !in_quotes) { values.push(current_value.trim()); current_value = ''; }
            else current_value += char;
        }
        values.push(current_value.trim());

        if (values.length === headers.length) {
            return headers.reduce((row, header, i) => ({ ...row, [header]: values[i].replace(/"/g, '') }), {});
        }
        return null;
    }).filter(row => row !== null);
}


// --- Data Loading and Setup ---

async function loadData() {
    try {
        const text = await fetch('data/dpeda_data.csv').then(res => res.text());
        dpedaData = parseCSV(text).filter(d => d.Code && d.Code.length === 3 && parseInt(d.Year) >= 1990);

        populateCountryDropdowns();
        initChart();
        chartContainer.classList.add('loaded'); // Hide loading message
    } catch (error) {
        console.error('Data loading error:', error);
        document.getElementById("loading-message").textContent = "Error loading data.";
    }
}

function populateCountryDropdowns() {
    const countrySelect = document.getElementById("country");
    const countryCompareSelect = document.getElementById("country-compare");
    const countries = [...new Set(dpedaData.map(item => item.Entity))].sort();
    
    [countrySelect, countryCompareSelect].forEach(select => {
        select.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    });

    countrySelect.value = countries.includes('India') ? 'India' : countries[0] || '';
    countryCompareSelect.value = countries.includes('China') ? 'China' : countries[1] || countries[0] || '';
}


// --- Chart Logic: Comparison Chart ---

function getCountryData(countryName, metricColumn, color, bgColor) {
    const filteredData = dpedaData
        .filter(d => d.Entity === countryName && d[metricColumn] && !isNaN(parseFloat(d[metricColumn])))
        .map(d => ({ year: parseInt(d.Year), value: parseFloat(d[metricColumn]) }))
        .sort((a, b) => a.year - b.year);

    return {
        label: countryName,
        data: filteredData.map(d => ({ x: d.year, y: d.value })),
        labels: filteredData.map(d => d.year),
        borderColor: color,
        backgroundColor: bgColor, 
        tension: 0.4, 
        fill: true, 
        pointRadius: 5, 
        pointHoverRadius: 9, 
        borderWidth: 4, 
        spanGaps: true 
    };
}

function initChart() {
    const metric = document.getElementById("metric").value;
    const country1 = document.getElementById("country").value;
    const country2 = document.getElementById("country-compare").value;
    
    const dataset1 = getCountryData(country1, metric, COLORS.PRIMARY, COLORS.PRIMARY_BG);
    const dataset2 = getCountryData(country2, metric, COLORS.COMPARE, COLORS.COMPARE_BG);
    
    const allYears = [...new Set([...dataset1.labels, ...dataset2.labels])].sort((a, b) => a - b);

    myChart = new Chart(ctx, {
        type: "line",
        data: { labels: allYears, datasets: [dataset1, dataset2] },
        options: {
            responsive: true, maintainAspectRatio: false, 
            plugins: {
                title: { display: true, text: `${METRIC_COLUMNS[metric].label} Comparison: ${country1} vs ${country2}`, color: '#FFFFFF' }, // White title
                legend: { labels: { color: '#FFFFFF' } }, // White legend
                tooltip: { callbacks: { label: c => `${c.dataset.label}: ${METRIC_COLUMNS[metric].format(c.parsed.y)}` } }
            },
            scales: {
                x: { 
                    type: 'linear', 
                    title: { display: true, text: 'Year', color: '#AAAAAA' },
                    ticks: { precision: 0, color: '#AAAAAA' },
                    grid: { color: '#333333' } // Darker grid lines
                },
                y: { 
                    beginAtZero: true, 
                    title: { display: true, text: METRIC_COLUMNS[metric].label, color: '#AAAAAA' },
                    ticks: { color: '#AAAAAA' },
                    grid: { color: '#333333' }
                }
            },
            animation: { duration: 800, easing: 'easeInOutQuad' } 
        }
    });
}
function updateChart() {
    const metric = document.getElementById("metric").value;
    const country1 = document.getElementById("country").value;
    const country2 = document.getElementById("country-compare").value;
    
    const dataset1 = getCountryData(country1, metric, COLORS.PRIMARY, COLORS.PRIMARY_BG);
    const dataset2 = getCountryData(country2, metric, COLORS.COMPARE, COLORS.COMPARE_BG);
    
    const allYears = [...new Set([...dataset1.labels, ...dataset2.labels])].sort((a, b) => a - b);
    
    myChart.data.labels = allYears;
    myChart.data.datasets = [dataset1, dataset2].filter(d => d.data.length > 0);
    myChart.options.plugins.title.text = `${METRIC_COLUMNS[metric].label} Comparison: ${country1} vs ${country2}`;
    myChart.options.scales.y.title.text = METRIC_COLUMNS[metric].label; 

    myChart.update();
}

document.getElementById("metric").addEventListener("change", updateChart);
document.getElementById("country").addEventListener("change", updateChart);
document.getElementById("country-compare").addEventListener("change", updateChart);
loadData();