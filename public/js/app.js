import { db } from './firebase-config.js';
import { collection, addDoc, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let selectedDate = new Date();
let currentMonth = new Date();
let existingEntries = new Set();

// Initialize calendar when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    loadExistingEntries();
    // Set the initial selected date
    document.getElementById('selectedDate').value = selectedDate.toISOString().split('T')[0];
});

async function loadExistingEntries() {
    try {
        const entriesRef = collection(db, 'daily_entries');
        const querySnapshot = await getDocs(entriesRef);
        existingEntries.clear();
        
        querySnapshot.forEach(doc => {
            const data = doc.data();
            // Normalize the date to local timezone
            const entryDate = new Date(data.date);
            const dateString = entryDate.toISOString().split('T')[0];
            existingEntries.add(dateString);
        });
        
        console.log('Loaded existing entries:', existingEntries);
        renderCalendar();
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

function initializeCalendar() {
    document.getElementById('prevPeriod').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextPeriod').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const currentMonthLabel = document.getElementById('currentPeriod');
    
    // Update month label
    currentMonthLabel.textContent = currentMonth.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });

    // Clear calendar
    calendar.innerHTML = '';

    // Add day headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    // Get first day of month and total days
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }

    // Add days of month
    for (let date = 1; date <= lastDay.getDate(); date++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date;

        const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), date);
        const dateString = currentDate.toISOString().split('T')[0];
        dayElement.dataset.date = dateString;

        // Add classes for today and selected date
        if (isToday(currentDate)) {
            dayElement.classList.add('today');
        }
        if (isSameDate(currentDate, selectedDate)) {
            dayElement.classList.add('selected');
        }

        // Check for existing entries
        if (existingEntries.has(dateString)) {
            console.log('Found entry for date:', dateString);
            dayElement.classList.add('has-entry');
            dayElement.addEventListener('mouseenter', () => showEntryPreview(currentDate));
            dayElement.addEventListener('mouseleave', hideEntryPreview);
        }

        dayElement.addEventListener('click', () => {
            selectedDate = currentDate;
            document.getElementById('selectedDate').value = dateString;
            
            // Update visual selection
            document.querySelectorAll('.calendar-day').forEach(day => {
                day.classList.remove('selected');
            });
            dayElement.classList.add('selected');
        });

        calendar.appendChild(dayElement);
    }
}

function isToday(date) {
    const today = new Date();
    return isSameDate(date, today);
}

function isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

async function showEntryPreview(date) {
    const preview = document.getElementById('entryPreview');
    const dateString = date.toISOString().split('T')[0];
    
    try {
        const entriesRef = collection(db, 'daily_entries');
        const q = query(entriesRef, where('date', '==', dateString));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            const entry = querySnapshot.docs[0].data();
            // Create date with time set to noon to avoid timezone issues
            const displayDate = new Date(entry.date + 'T12:00:00');
            preview.innerHTML = `
                <div class="preview-content">
                    <h4>${displayDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</h4>
                    <div class="preview-stat">
                        <span class="preview-icon">🧘</span>
                        <span>${entry.yoga} min yoga</span>
                    </div>
                    <div class="preview-stat">
                        <span class="preview-icon">🏃‍♂️</span>
                        <span>${entry.cardio} min cardio</span>
                    </div>
                    <div class="preview-stat">
                        <span class="preview-icon">😴</span>
                        <span>${entry.sleep} hrs sleep</span>
                    </div>
                    <div class="preview-gratitude">
                        <small>🙏 ${entry.daily_gratitude}</small>
                    </div>
                </div>
            `;
            preview.classList.add('visible');
        }
    } catch (error) {
        console.error('Error loading entry preview:', error);
    }
}

function hideEntryPreview() {
    const preview = document.getElementById('entryPreview');
    preview.classList.remove('visible');
}

// Form submission handler
document.getElementById('trackerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const selectedDateValue = document.getElementById('selectedDate').value;
    if (!selectedDateValue) {
        alert('Please select a date first');
        return;
    }

    // Create date in local timezone
    const entryDate = new Date(selectedDateValue);
    const formattedDate = entryDate.toISOString().split('T')[0];

    const formData = {
        yoga: parseInt(document.getElementById('yoga').value),
        cardio: parseInt(document.getElementById('cardio').value),
        sleep: parseFloat(document.getElementById('sleep').value),
        daily_gratitude: document.getElementById('dailyGratitude').value,
        date: formattedDate,
        created_at: new Date().toISOString()
    };

    try {
        // Check if entry already exists for this date
        const entriesRef = collection(db, 'daily_entries');
        const q = query(entriesRef, where('date', '==', formattedDate));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            if (!confirm('An entry already exists for this date. Do you want to add another entry?')) {
                return;
            }
        }

        await addDoc(collection(db, 'daily_entries'), formData);
        showSuccessMessage();
        e.target.reset();
        
        // Update calendar to show new entry
        existingEntries.add(formattedDate);
        renderCalendar();
        
        // Reset date selection to today
        selectedDate = new Date();
        document.getElementById('selectedDate').value = selectedDate.toISOString().split('T')[0];
    } catch (error) {
        console.error('Error saving entry:', error);
        showErrorMessage();
    }
});

function showSuccessMessage() {
    const button = document.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = '✨ Entry Saved!';
    button.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

function showErrorMessage() {
    const button = document.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = '❌ Error Saving Entry';
    button.style.backgroundColor = '#c0392b';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
} 