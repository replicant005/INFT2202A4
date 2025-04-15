import Chart from 'chart.js/auto';
/**
 * Fetches visitor statistics data from JSON file
 * @returns Promise resolving to visitor statistics data
 */
const fetchStatisticsData = async () => {
    try {
        const response = await fetch('data/statistics.json');
        if (!response.ok) {
            throw new Error('Failed to load statistics data');
        }
        const data = await response.json();
        return data.statistics;
    }
    catch (error) {
        console.error('[ERROR] Failed to load statistics data:', error);
        return [];
    }
};
/**
 * Generates HTML for the statistics page
 * @returns Promise resolving to HTML string
 */
export const renderStatisticsPage = async () => {
    return `
    <div class="container py-5">
        <h1 class="text-center mb-5">Visitor Statistics</h1>
        
        <div class="row">
            <div class="col-md-8 offset-md-2 mb-5">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h2 class="h4 mb-0">Monthly Visitors</h2>
                    </div>
                    <div class="card-body">
                        <canvas id="visitorChart" height="300"></canvas>
                    </div>
                </div>
            </div>
        </div>
        

            
            <div class="col-md-6 mb-4">
                <div class="card shadow">
                    <div class="card-header bg-info text-white">
                        <h2 class="h4 mb-0">Session Duration</h2>
                    </div>
                    <div class="card-body">
                        <canvas id="sessionDurationChart" height="250"></canvas>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-12">
                <div class="card shadow">
                    <div class="card-header bg-warning">
                        <h2 class="h4 mb-0">Detailed Statistics</h2>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Visitors</th>
                                        <th>New Users</th>
                                        <th>Page Views</th>
                                        <th>Avg. Session Duration</th>
                                        <th>Bounce Rate</th>
                                    </tr>
                                </thead>
                                <tbody id="statisticsTableBody">
                                    <!-- Table rows will be populated dynamically -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};
/**
 * Initializes statistics page functionality
 */
export const initStatisticsPage = async () => {
    try {
        // Fetch the statistics data
        const statistics = await fetchStatisticsData();
        if (statistics.length === 0) {
            console.error('[ERROR] No statistics data available');
            return;
        }
        // Populate table
        populateStatisticsTable(statistics);
        // Create charts
        createVisitorChart(statistics);
        createUserTypeChart(statistics);
        createSessionDurationChart(statistics);
    }
    catch (error) {
        console.error('[ERROR] Failed to initialize statistics page:', error);
    }
};
/**
 * Populates the statistics table with data
 * @param statistics Array of visitor statistics
 */
const populateStatisticsTable = (statistics) => {
    const tableBody = document.getElementById('statisticsTableBody');
    if (!tableBody) {
        console.error('[ERROR] Statistics table body not found');
        return;
    }
    let tableHtml = '';
    statistics.forEach(stat => {
        tableHtml += `
            <tr>
                <td>${stat.date}</td>
                <td>${stat.visitors.toLocaleString()}</td>
                <td>${stat.newUsers.toLocaleString()}</td>
                <td>${stat.pageViews.toLocaleString()}</td>
                <td>${stat.avgSessionDuration.toFixed(2)}s</td>
                <td>${stat.bounceRate.toFixed(2)}%</td>
            </tr>
        `;
    });
    tableBody.innerHTML = tableHtml;
};
/**
 * Creates a line chart showing visitors over time
 * @param statistics Array of visitor statistics
 */
const createVisitorChart = (statistics) => {
    const chartCanvas = document.getElementById('visitorChart');
    if (!chartCanvas) {
        console.error('[ERROR] Visitor chart canvas not found');
        return;
    }
    const labels = statistics.map(stat => stat.date);
    const visitorData = statistics.map(stat => stat.visitors);
    const pageViewData = statistics.map(stat => stat.pageViews);
    // @ts-ignore - Chart is loaded from CDN
    new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Visitors',
                    data: visitorData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Page Views',
                    data: pageViewData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.3,
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};
/**
 * Creates a pie chart showing new vs returning users
 * @param statistics Array of visitor statistics
 */
const createUserTypeChart = (statistics) => {
    const chartCanvas = document.getElementById('userTypeChart');
    if (!chartCanvas) {
        console.error('[ERROR] User type chart canvas not found');
        return;
    }
    // Calculate totals
    const totalNewUsers = statistics.reduce((sum, stat) => sum + stat.newUsers, 0);
    const totalVisitors = statistics.reduce((sum, stat) => sum + stat.visitors, 0);
    const totalReturningUsers = totalVisitors - totalNewUsers;
    // @ts-ignore - Chart is loaded from CDN
    new Chart(chartCanvas, {
        type: 'pie',
        data: {
            labels: ['New Users', 'Returning Users'],
            datasets: [{
                    data: [totalNewUsers, totalReturningUsers],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
};
/**
 * Creates a bar chart showing average session duration
 * @param statistics Array of visitor statistics
 */
const createSessionDurationChart = (statistics) => {
    const chartCanvas = document.getElementById('sessionDurationChart');
    if (!chartCanvas) {
        console.error('[ERROR] Session duration chart canvas not found');
        return;
    }
    const labels = statistics.map(stat => stat.date);
    const durationData = statistics.map(stat => stat.avgSessionDuration);
    // @ts-ignore - Chart is loaded from CDN
    new Chart(chartCanvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                    label: 'Avg. Session Duration (seconds)',
                    data: durationData,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};
export default { renderStatisticsPage, initStatisticsPage };
//# sourceMappingURL=statistics.js.map