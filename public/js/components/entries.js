export function renderEntries(entries) {
    return entries.slice(0, 5).map(entry => `
        <div class="entry">
            <h3>${new Date(entry.date).toLocaleDateString()}</h3>
            <p><strong>🧘 Yoga:</strong> ${entry.yoga} minutes</p>
            <p><strong>🏃‍♂️ Cardio:</strong> ${entry.cardio} minutes</p>
            <p><strong>😴 Sleep:</strong> ${entry.sleep} hours</p>
            <p><strong>🙏 Gratitude:</strong> ${entry.dailyGratitude}</p>
        </div>
    `).join('');
}