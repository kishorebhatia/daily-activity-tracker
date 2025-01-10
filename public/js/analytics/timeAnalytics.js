export function calculateAverages(entries) {
    if (!entries || entries.length === 0) return null;

    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const weeklyEntries = entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
    const monthlyEntries = entries.filter(entry => new Date(entry.date) >= oneMonthAgo);

    return {
        weekly: calculatePeriodAverages(weeklyEntries),
        monthly: calculatePeriodAverages(monthlyEntries)
    };
}

function calculatePeriodAverages(entries) {
    if (!entries || entries.length === 0) return null;

    const sum = entries.reduce((acc, entry) => ({
        yoga: acc.yoga + Number(entry.yoga),
        cardio: acc.cardio + Number(entry.cardio),
        sleep: acc.sleep + Number(entry.sleep)
    }), { yoga: 0, cardio: 0, sleep: 0 });

    return {
        yoga: Math.round(sum.yoga / entries.length),
        cardio: Math.round(sum.cardio / entries.length),
        sleep: (sum.sleep / entries.length).toFixed(1)
    };
}