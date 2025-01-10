export function validateEntry(entry) {
    if (!entry) {
        throw new Error('Entry data is required');
    }

    const { yoga, cardio, sleep, dailyGratitude } = entry;

    if (!Number.isInteger(yoga) || yoga < 0) {
        throw new Error('Yoga minutes must be a positive number');
    }

    if (!Number.isInteger(cardio) || cardio < 0) {
        throw new Error('Cardio minutes must be a positive number');
    }

    if (typeof sleep !== 'number' || sleep < 0) {
        throw new Error('Sleep hours must be a positive number');
    }

    if (!dailyGratitude || dailyGratitude.trim().length === 0) {
        throw new Error('Daily gratitude is required');
    }
}