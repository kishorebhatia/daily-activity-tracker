export function showSuccessMessage() {
    const button = document.querySelector('button[type="submit"]');
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = '✨ Entry Saved!';
    button.style.backgroundColor = '#27ae60';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#2c3e50';
        button.disabled = false;
    }, 1500);
}

export function showErrorMessage() {
    const button = document.querySelector('button[type="submit"]');
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = '❌ Error Saving Entry';
    button.style.backgroundColor = '#c0392b';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '#2c3e50';
    }, 1500);
}