import { fetchEntries } from '../utils/dataFetcher.js';

export async function fetchDashboardData() {
    try {
        const entries = await fetchEntries();
        return entries || [];
    } catch (error) {
        throw new Error('Failed to load dashboard data', { cause: error });
    }
}