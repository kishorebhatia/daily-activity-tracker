import { db } from '../firebase-config.js';
import { collection, query, orderBy, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { showLoading, showError } from '../utils/ui.js';
import { Entry } from '../models/Entry.js';

class DashboardManager {
    constructor() {
        this.entries = [];
    }

    async initialize() {
        try {
            showLoading(true);
            await this.loadEntries();
            this.renderEntries();
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            showError('Failed to load entries');
        } finally {
            showLoading(false);
        }
    }

    async loadEntries() {
        const entriesRef = collection(db, 'daily_entries');
        const q = query(entriesRef, orderBy('date', 'desc'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        this.entries = snapshot.docs.map(doc => Entry.fromFirestore(doc));
    }

    renderEntries() {
        const container = document.getElementById('dashboard');
        if (!this.entries.length) {
            container.innerHTML = '<div class="no-data">No entries found</div>';
            return;
        }

        const groupedEntries = this.groupEntriesByDate();
        container.innerHTML = `
            <div class="entries-container">
                ${Object.entries(groupedEntries).map(([date, entries]) => `
                    <div class="day-entries">
                        <h2 class="date-header">${entries[0].displayDate}</h2>
                        ${entries.map(entry => this.renderEntry(entry)).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    groupEntriesByDate() {
        return this.entries.reduce((groups, entry) => {
            if (!groups[entry.date]) {
                groups[entry.date] = [];
            }
            groups[entry.date].push(entry);
            return groups;
        }, {});
    }

    renderEntry(entry) {
        return `
            <div class="entry-card">
                <div class="entry-time">${entry.displayTime}</div>
                <div class="entry-stats">
                    <div class="stat">
                        <span class="stat-icon">🧘</span>
                        <span class="stat-value">${entry.yoga} minutes yoga</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">🏃‍♂️</span>
                        <span class="stat-value">${entry.cardio} minutes cardio</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon">😴</span>
                        <span class="stat-value">${entry.sleep} hours sleep</span>
                    </div>
                </div>
                <div class="entry-gratitude">
                    <p>${entry.daily_gratitude}</p>
                </div>
            </div>
        `;
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new DashboardManager();
    dashboard.initialize();
});