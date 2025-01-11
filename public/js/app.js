import { firebaseService } from './firebase.js';
import * as dateUtils from './utils/dates.js';
import * as uiUtils from './utils/ui.js';
import { collection, addDoc, query, where, getDocs, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { Entry } from './models/Entry.js';

class ActivityTracker {
    constructor() {
        this.selectedDate = new Date();
        this.existingEntries = new Map();
        this.db = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            uiUtils.showLoading(true);
            this.db = await firebaseService.initialize();
            await this.loadExistingEntries();
            this.initializeCalendar();
            this.initializeEventListeners();
            this.initialized = true;
        } catch (error) {
            uiUtils.showError('Failed to initialize application');
            console.error(error);
        } finally {
            uiUtils.showLoading(false);
        }
    }

    async loadExistingEntries() {
        try {
            const entriesRef = collection(this.db, 'daily_entries');
            const querySnapshot = await getDocs(entriesRef);
            this.existingEntries.clear();
            
            querySnapshot.forEach(doc => {
                const data = { id: doc.id, ...doc.data() };
                const date = data.date;
                
                if (!this.existingEntries.has(date)) {
                    this.existingEntries.set(date, []);
                }
                this.existingEntries.get(date).push(data);
            });
        } catch (error) {
            throw new Error('Failed to load entries: ' + error.message);
        }
    }

    initializeCalendar() {
        this.renderCalendar();
        document.getElementById('selectedDate').value = dateUtils.formatDate(this.selectedDate);
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        const currentMonthLabel = document.getElementById('currentPeriod');
        
        if (!calendar || !currentMonthLabel) {
            console.error('Calendar elements not found');
            return;
        }

        // Clear existing calendar
        calendar.innerHTML = '';
        
        const today = new Date();
        
        // Update month/year display
        currentMonthLabel.textContent = today.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Add day headers
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        daysOfWeek.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendar.appendChild(dayHeader);
        });

        // Get first day of month and total days
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            calendar.appendChild(this.createEmptyDay());
        }

        // Add days of month
        for (let date = 1; date <= lastDay.getDate(); date++) {
            calendar.appendChild(this.createDayElement(date));
        }
    }

    createDayElement(date) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date;

        const today = new Date();
        const dayDate = new Date(today.getFullYear(), today.getMonth(), date, 12, 0, 0);
        const dateString = dateUtils.formatDate(dayDate);

        // Add classes for today and selected date
        if (dateUtils.isToday(dayDate)) {
            dayElement.classList.add('today');
        }
        if (dateUtils.isSameDate(dayDate, this.selectedDate)) {
            dayElement.classList.add('selected');
        }

        // Check for existing entries
        const existingEntry = this.existingEntries.get(dateString);
        if (existingEntry) {
            dayElement.classList.add('has-entry');
            dayElement.addEventListener('mouseenter', (e) => uiUtils.showEntryPreview(e, existingEntry, dayDate));
            dayElement.addEventListener('mouseleave', uiUtils.hideEntryPreview);
        }

        // Add click handler
        dayElement.addEventListener('click', () => {
            this.selectedDate = dayDate;
            document.getElementById('selectedDate').value = dateString;
            
            // Update selected state
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            dayElement.classList.add('selected');
        });

        return dayElement;
    }

    createEmptyDay() {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        return emptyDay;
    }

    initializeEventListeners() {
        const form = document.getElementById('trackerForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleFormSubmit(e);
        });
    }

    async handleFormSubmit(e) {
        const submitButton = e.target.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Saving...';
        
        try {
            const selectedDateValue = document.getElementById('selectedDate').value;
            if (!selectedDateValue) {
                throw new Error('Please select a date first');
            }

            const entry = new Entry({
                yoga: parseInt(document.getElementById('yoga').value),
                cardio: parseInt(document.getElementById('cardio').value),
                sleep: parseFloat(document.getElementById('sleep').value),
                daily_gratitude: document.getElementById('dailyGratitude').value.trim(),
                date: selectedDateValue,
            });

            await this.saveEntry(entry);
            uiUtils.showSuccess();
            e.target.reset();
            
            // Update local entries
            if (!this.existingEntries.has(entry.date)) {
                this.existingEntries.set(entry.date, []);
            }
            this.existingEntries.get(entry.date).push(entry);
            this.renderCalendar();
            
        } catch (error) {
            uiUtils.showError(error.message);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Save Entry';
        }
    }

    async saveEntry(entry) {
        try {
            const entriesRef = collection(this.db, 'daily_entries');
            await addDoc(entriesRef, entry.toFirestore());
        } catch (error) {
            throw new Error('Failed to save entry: ' + error.message);
        }
    }
}

// Initialize the app
const tracker = new ActivityTracker();
document.addEventListener('DOMContentLoaded', () => tracker.initialize()); 