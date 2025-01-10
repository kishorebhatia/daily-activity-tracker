import { getAllEntries as getEntries, createEntry as saveEntry } from '../repositories/entryRepository.js';

export async function getAllEntries() {
    try {
        const entries = await getEntries();
        return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
        throw new Error('Failed to fetch entries', { cause: error });
    }
}

export async function createEntry(data) {
    try {
        const entry = {
            date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            ...data
        };
        return await saveEntry(entry);
    } catch (error) {
        throw new Error('Failed to create entry', { cause: error });
    }
}