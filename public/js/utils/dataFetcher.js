export async function fetchEntries() {
    try {
        const response = await fetch('/api/entries');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: Expected an array');
        }
        
        return data;
    } catch (error) {
        console.error('Data fetching error:', error);
        throw error;
    }
}