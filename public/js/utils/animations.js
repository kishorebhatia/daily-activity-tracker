export function addFormAnimation() {
    const form = document.querySelector('.form-card');
    if (!form) return;

    form.style.opacity = '0';
    form.style.transform = 'translateY(20px)';

    requestAnimationFrame(() => {
        form.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
    });
}

export function addInputFocusEffects() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
    });
}