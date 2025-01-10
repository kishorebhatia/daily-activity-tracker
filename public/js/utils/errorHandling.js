export function handleError(error, context) {
    console.error(`Error in ${context}:`, error);
    
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-message';
    
    const message = getErrorMessage(error, context);
    errorContainer.innerHTML = `
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" class="error-dismiss">Dismiss</button>
    `;
    
    return errorContainer;
}

function getErrorMessage(error, context) {
    const message = error.message || error.toString();
    
    // Handle specific error cases
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    if (message.includes('permission') || message.includes('denied')) {
        return 'You don\'t have permission to perform this action. Please try again later.';
    }
    
    if (message.includes('quota') || message.includes('unavailable')) {
        return 'The service is temporarily unavailable. Please try again in a few minutes.';
    }
    
    // Return the specific error message if it's a validation error
    if (message.includes('Please enter') || message.includes('must be')) {
        return message;
    }
    
    // Default error messages based on context
    switch (context) {
        case 'entry':
            return 'Unable to save your entry. Please check your input and try again.';
        case 'dashboard':
            return 'Unable to load your dashboard. Please refresh the page.';
        default:
            return 'Something went wrong. Please try again.';
    }
}