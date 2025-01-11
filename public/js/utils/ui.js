import { formatDisplayDate } from './dates.js';

/**
 * Show loading overlay
 * @param {boolean} show - Whether to show or hide loading overlay
 */
export function showLoading(show) {
    let loadingEl = document.querySelector('.loading-overlay');
    
    if (show) {
        if (!loadingEl) {
            loadingEl = document.createElement('div');
            loadingEl.className = 'loading-overlay';
            loadingEl.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading your wellness tracker...</p>
            `;
            document.body.appendChild(loadingEl);
        }
    } else {
        loadingEl?.remove();
    }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
export function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
export function showSuccess(message = 'Entry saved successfully!') {
    const button = document.querySelector('button[type="submit"]');
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = '✨ ' + message;
    button.style.backgroundColor = '#27ae60';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 2000);
}

/**
 * Show entry preview popup
 * @param {Event} event - Mouse event
 * @param {Object} entries - Entry data to display
 * @param {Date} date - The actual date object
 */
export function showEntryPreview(event, entries, date) {
    const preview = document.getElementById('entryPreview');
    if (!preview) return;

    const entriesHtml = entries.map(entry => `
        <div class="preview-entry">
            <div class="preview-time">${new Date(entry.timestamp).toLocaleTimeString()}</div>
            <div class="preview-stat">
                <span class="preview-icon">🧘</span>
                <span class="preview-value">${entry.yoga} minutes yoga</span>
            </div>
            <div class="preview-stat">
                <span class="preview-icon">🏃‍♂️</span>
                <span class="preview-value">${entry.cardio} minutes cardio</span>
            </div>
            <div class="preview-stat">
                <span class="preview-icon">😴</span>
                <span class="preview-value">${entry.sleep} hours sleep</span>
            </div>
            <div class="preview-gratitude">${entry.daily_gratitude}</div>
        </div>
    `).join('<hr class="preview-divider">');

    preview.innerHTML = `
        <div class="preview-header">${formatDisplayDate(date)}</div>
        <div class="preview-entries">
            ${entriesHtml}
        </div>
    `;

    // Make preview visible but transparent for measurements
    preview.style.display = 'block';
    preview.style.opacity = '0';

    // Get positions
    const dayRect = event.target.getBoundingClientRect();
    const previewRect = preview.getBoundingClientRect();
    
    // Calculate initial position (to the right of the day)
    let left = dayRect.right + 10; // 10px gap
    let top = dayRect.top + window.scrollY;

    // Check if preview would go off right edge of screen
    if (left + previewRect.width > window.innerWidth) {
        // Position to the left of the day instead
        left = dayRect.left - previewRect.width - 10;
    }

    // Check if preview would go off bottom of screen
    if (top + previewRect.height > window.innerHeight + window.scrollY) {
        // Align bottom of preview with bottom of day element
        top = dayRect.bottom + window.scrollY - previewRect.height;
    }

    // Apply position and show preview
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
    preview.style.opacity = '1';
    preview.classList.add('visible');
}

/**
 * Hide entry preview popup
 */
export function hideEntryPreview() {
    const preview = document.getElementById('entryPreview');
    preview?.classList.remove('visible');
} 