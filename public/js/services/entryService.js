import { validateEntry } from '../utils/validation.js';

export async function saveEntry(formData) {
    try {
        validateEntry(formData);
        
        const response = await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        throw new Error('Failed to save entry', { cause: error });
    }
}