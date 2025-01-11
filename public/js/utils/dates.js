/**
 * Format a date object to YYYY-MM-DD string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date to compare
 * @param {Date} date2 - Second date to compare
 * @returns {boolean} True if dates are the same day
 */
export function isSameDate(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

/**
 * Check if a date is today
 * @param {Date} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
    return isSameDate(date, new Date());
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
} 