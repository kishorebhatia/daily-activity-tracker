import { calculateAverages } from '../analytics/timeAnalytics.js';
import { analyzeGratitudeSentiments } from '../analytics/gratitudeAnalytics.js';

export function renderDashboard(entries) {
    const analytics = calculateAverages(entries);
    const gratitudeAnalysis = analyzeGratitudeSentiments(entries);
    
    return `
        <div class="dashboard-grid">
            ${renderAveragesCard('Weekly Activity', analytics.weekly)}
            ${renderAveragesCard('Monthly Activity', analytics.monthly)}
            ${renderGratitudeCard(gratitudeAnalysis)}
        </div>
    `;
}

function renderAveragesCard(title, averages) {
    if (!averages) {
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
                    <span class="metric-value">${averages.yoga}</span>
                    <span class="metric-label">min/day</span>
                </div>
                <div class="metric">
                    <span class="metric-icon">🏃‍♂️</span>
                    <span class="metric-value">${averages.cardio}</span>
                    <span class="metric-label">min/day</span>
                </div>
                <div class="metric">
                    <span class="metric-icon">😴</span>
                    <span class="metric-value">${averages.sleep}</span>
                    <span class="metric-label">hrs/day</span>
                </div>
            </div>
        </div>
    `;
}

function renderGratitudeCard(analysis) {
    if (!analysis.themes.length) {
        return `
            <div class="dashboard-card">
                <h3>Gratitude Themes</h3>
                <p class="no-data">Add more entries to see gratitude themes</p>
            </div>
        `;
    }

    return `
        <div class="dashboard-card">
            <h3>Gratitude Themes</h3>
            <div class="themes-list">
                ${analysis.themes.map(theme => `
                    <div class="theme">
                        <span class="theme-name">${theme.theme}</span>
                        <div class="theme-bar">
                            <div class="theme-progress" style="width: ${theme.percentage}%"></div>
                        </div>
                        <span class="theme-percentage">${theme.percentage}%</span>
                    </div>
                `).join('')}
            </div>
            <p class="analysis-note">Based on your last ${analysis.count} entries</p>
        </div>
    `;
}

function calculateAverages(entries) {
    if (!entries || entries.length === 0) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const weeklyEntries = entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
    const monthlyEntries = entries.filter(entry => new Date(entry.date) >= oneMonthAgo);

    return {
        weekly: calculatePeriodAverages(weeklyEntries),
        monthly: calculatePeriodAverages(monthlyEntries)
    };
}

function calculatePeriodAverages(entries) {
    if (!entries || entries.length === 0) return null;

    const sum = entries.reduce((acc, entry) => ({
        yoga: acc.yoga + Number(entry.yoga),
        cardio: acc.cardio + Number(entry.cardio),
        sleep: acc.sleep + Number(entry.sleep)
    }), { yoga: 0, cardio: 0, sleep: 0 });

    return {
        yoga: Math.round(sum.yoga / entries.length),
        cardio: Math.round(sum.cardio / entries.length),
        sleep: (sum.sleep / entries.length).toFixed(1)
    };
}

function analyzeGratitudeSentiments(entries) {
    if (!entries || entries.length === 0) {
        return { themes: [], count: 0 };
    }

    const commonThemes = new Map();
    let totalThemes = 0;

    entries.forEach(entry => {
        const gratitude = entry.daily_gratitude || '';
        const words = gratitude.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            if (word.length > 3) {
                commonThemes.set(word, (commonThemes.get(word) || 0) + 1);
                totalThemes++;
            }
        });
    });

    const themes = Array.from(commonThemes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme, count]) => ({
            theme,
            percentage: Math.round((count / totalThemes) * 100)
        }));

    return {
        themes,
        count: entries.length
    };
}