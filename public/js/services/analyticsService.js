import { Entry } from '../models/Entry.js';

const STOP_WORDS = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what']);

export class AnalyticsService {
    static calculateTimeStats(entries) {
        if (!entries?.length) return null;

        const now = new Date();
        const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        return {
            weekly: this.calculatePeriodStats(
                entries.filter(entry => new Date(entry.date) >= oneWeekAgo)
            ),
            monthly: this.calculatePeriodStats(
                entries.filter(entry => new Date(entry.date) >= oneMonthAgo)
            ),
            total: entries.length
        };
    }

    static calculatePeriodStats(entries) {
        if (!entries?.length) return null;

        const totals = entries.reduce((acc, entry) => ({
            yoga: acc.yoga + entry.yoga,
            cardio: acc.cardio + entry.cardio,
            sleep: acc.sleep + entry.sleep
        }), { yoga: 0, cardio: 0, sleep: 0 });

        return {
            yoga: Math.round(totals.yoga / entries.length),
            cardio: Math.round(totals.cardio / entries.length),
            sleep: (totals.sleep / entries.length).toFixed(1),
            count: entries.length
        };
    }

    static analyzeGratitude(entries) {
        if (!entries?.length) return { keywords: [], totalEntries: 0 };

        const wordFrequency = new Map();
        let totalWords = 0;

        entries.forEach(entry => {
            if (!entry.daily_gratitude) return;

            const words = entry.daily_gratitude
                .toLowerCase()
                .split(/\W+/)
                .filter(word => word.length > 3 && !STOP_WORDS.has(word));

            words.forEach(word => {
                wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
                totalWords++;
            });
        });

        const keywords = Array.from(wordFrequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({
                word,
                count,
                percentage: Math.round((count / totalWords) * 100)
            }));

        return {
            keywords,
            totalEntries: entries.length,
            totalWords
        };
    }

    static groupEntriesByDate(entries) {
        return entries.reduce((groups, entry) => {
            const date = entry.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(entry);
            return groups;
        }, {});
    }
} 