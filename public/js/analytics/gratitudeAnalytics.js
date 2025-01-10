export function analyzeGratitudeSentiments(entries) {
    if (!entries || entries.length === 0) {
        return { themes: [], count: 0 };
    }

    const commonThemes = new Map();
    let totalThemes = 0;

    entries.forEach(entry => {
        const gratitude = entry.daily_gratitude || '';
        const words = gratitude.toLowerCase().split(/\s+/);
        
        words.forEach(word => {
            if (word.length > 3) {  // Skip short words
                commonThemes.set(word, (commonThemes.get(word) || 0) + 1);
                totalThemes++;
            }
        });
    });

    const themes = Array.from(commonThemes.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([theme, count]) => ({
            theme,
            percentage: Math.round((count / totalThemes) * 100)
        }));

    return {
        themes,
        count: entries.length
    };
}