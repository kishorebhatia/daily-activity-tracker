import { showSuccessMessage, showErrorMessage } from '../utils/notifications.js';
import { addFormAnimation, addInputFocusEffects } from '../utils/animations.js';
import { saveEntry } from '../services/entryService.js';
import { handleError } from '../utils/errorHandling.js';

async function handleFormSubmission(formData) {
    try {
        const response = await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save entry');
        }

        const result = await response.json();
        if (!result.id) {
            throw new Error('Invalid response from server');
        }

        return result;
    } catch (error) {
        console.error('Form submission error:', error);
        throw error;
    }
}

function validateFormData(formData) {
    const { yoga, cardio, sleep, dailyGratitude } = formData;

    if (!yoga || isNaN(yoga) || yoga < 0) {
        throw new Error('Please enter valid minutes for yoga');
    }
    if (!cardio || isNaN(cardio) || cardio < 0) {
        throw new Error('Please enter valid minutes for cardio');
    }
    if (!sleep || isNaN(sleep) || sleep < 0) {
        throw new Error('Please enter valid hours for sleep');
    }
    if (!dailyGratitude || dailyGratitude.trim().length === 0) {
        throw new Error('Please enter your daily gratitude');
    }
}

function getFormData() {
    return {
        yoga: parseInt(document.getElementById('yoga').value, 10),
        cardio: parseInt(document.getElementById('cardio').value, 10),
        sleep: parseFloat(document.getElementById('sleep').value),
        dailyGratitude: document.getElementById('dailyGratitude').value.trim()
    };
}

function initializeForm() {
    const form = document.getElementById('trackerForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = getFormData();
            validateFormData(formData);
            
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Saving...';
            
            await handleFormSubmission(formData);
            
            showSuccessMessage();
            form.reset();
            
            // Redirect to dashboard after successful save
            setTimeout(() => {
                window.location.href = '/dashboard.html';
            }, 1500);
            
        } catch (error) {
            showErrorMessage();
            const errorElement = handleError(error, 'entry');
            const form = document.querySelector('.form-card');
            
            // Remove any existing error messages
            const existingError = form.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            form.insertBefore(errorElement, form.firstChild);
        } finally {
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = 'Record Today\'s Journey';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    addFormAnimation();
    addInputFocusEffects();
    initializeForm();
});