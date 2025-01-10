import { db } from '../firebase-config.js';
import { collection, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

async function loadDashboardData() {
    try {
        // Show loading state
        document.getElementById('dashboard').innerHTML = '<div class="loading">Loading dashboard</div>';
        document.getElementById('entriesList').innerHTML = '<div class="loading">Loading entries</div>';

        // Fetch entries from Firestore
        const entriesRef = collection(db, 'daily_entries');
        const q = query(entriesRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const entries = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Ensure proper date handling in local timezone
            const entryDate = new Date(data.date + 'T00:00:00');
            return {
                id: doc.id,
                ...data,
                // Format date consistently
                date: entryDate.toISOString().split('T')[0],
                displayDate: entryDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };
        });

        console.log('Loaded entries:', entries);

        // Update dashboard with analytics
        updateDashboard(entries);
        
        // Update entries list
        updateEntriesList(entries);

    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('dashboard').innerHTML = '<p class="error">Error loading dashboard data</p>';
        document.getElementById('entriesList').innerHTML = '<p class="error">Error loading entries</p>';
    }
}

function updateDashboard(entries) {
    console.log('Updating dashboard with entries:', entries);
    const dashboardContainer = document.getElementById('dashboard');
    
    // Calculate averages
    const weeklyData = calculatePeriodAverages(entries, 7);
    const monthlyData = calculatePeriodAverages(entries, 30);
    
    dashboardContainer.innerHTML = `
        <div class="dashboard-grid">
            ${renderAveragesCard('Weekly Activity', weeklyData)}
            ${renderAveragesCard('Monthly Activity', monthlyData)}
            ${renderGratitudeCard(entries)}
        </div>
    `;
}

function calculatePeriodAverages(entries, days) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const periodEntries = entries.filter(entry => new Date(entry.date) >= cutoffDate);
    
    if (periodEntries.length === 0) return null;
    
    const totals = periodEntries.reduce((acc, entry) => ({
        yoga: acc.yoga + Number(entry.yoga || 0),
        cardio: acc.cardio + Number(entry.cardio || 0),
        sleep: acc.sleep + Number(entry.sleep || 0)
    }), { yoga: 0, cardio: 0, sleep: 0 });
    
    return {
        yoga: Math.round(totals.yoga / periodEntries.length),
        cardio: Math.round(totals.cardio / periodEntries.length),
        sleep: (totals.sleep / periodEntries.length).toFixed(1)
    };
}

function renderAveragesCard(title, data) {
    if (!data) {
        return `
            <div class="dashboard-card">
                <h3>${title}</h3>
                <p class="no-data">Not enough data for this period</p>
            </div>
        `;
    }

    return `
        <div class="dashboard-card">
            <h3>${title}</h3>
            <div class="metrics-grid">
                <div class="metric">
                    <span class="metric-icon">🧘</span>
                    <span class="metric-value">${data.yoga}</span>
                    <span class="metric-label">min/day</span>
                </div>
                <div class="metric">
                    <span class="metric-icon">🏃‍♂️</span>
                    <span class="metric-value">${data.cardio}</span>
                    <span class="metric-label">min/day</span>
                </div>
                <div class="metric">
                    <span class="metric-icon">😴</span>
                    <span class="metric-value">${data.sleep}</span>
                    <span class="metric-label">hrs/day</span>
                </div>
            </div>
        </div>
    `;
}

function renderGratitudeCard(entries) {
    const recentEntries = entries.slice(0, 10); // Get last 10 entries
    const words = recentEntries
        .map(entry => entry.daily_gratitude || '')
        .join(' ')
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word.length > 3);
    
    const wordCount = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    const topWords = Object.entries(wordCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([word, count]) => ({
            word,
            percentage: Math.round((count / words.length) * 100)
        }));

    return `
        <div class="dashboard-card">
            <h3>Gratitude Themes</h3>
            ${topWords.length ? `
                <div class="themes-list">
                    ${topWords.map(({word, percentage}) => `
                        <div class="theme">
                            <span class="theme-name">${word}</span>
                            <div class="theme-bar">
                                <div class="theme-progress" style="width: ${percentage}%"></div>
                            </div>
                            <span class="theme-percentage">${percentage}%</span>
                        </div>
                    `).join('')}
                </div>
                <p class="analysis-note">Based on your last ${recentEntries.length} entries</p>
            ` : '<p class="no-data">Add more entries to see gratitude themes</p>'}
        </div>
    `;
}

function updateEntriesList(entries) {
    const entriesList = document.getElementById('entriesList');
    
    if (!entries.length) {
        entriesList.innerHTML = '<p class="no-data">No entries yet. Start tracking your daily activities!</p>';
        return;
    }

    entriesList.innerHTML = entries.map(entry => `
        <div class="entry">
            <h3>${entry.displayDate}</h3>
            <div class="entry-grid">
                <div class="entry-stat">
                    <span class="entry-icon">🧘</span>
                    <span class="entry-value">${entry.yoga}</span>
                    <span class="entry-label">min yoga</span>
                </div>
                <div class="entry-stat">
                    <span class="entry-icon">🏃‍♂️</span>
                    <span class="entry-value">${entry.cardio}</span>
                    <span class="entry-label">min cardio</span>
                </div>
                <div class="entry-stat">
                    <span class="entry-icon">😴</span>
                    <span class="entry-value">${entry.sleep}</span>
                    <span class="entry-label">hrs sleep</span>
                </div>
            </div>
            <div class="entry-gratitude">
                <p><strong>🙏 Gratitude:</strong> ${entry.daily_gratitude}</p>
            </div>
        </div>
    `).join('');
}

// Load dashboard data when the page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);

// Refresh dashboard data every 5 minutes
setInterval(loadDashboardData, 5 * 60 * 1000);