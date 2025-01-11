export class Entry {
    constructor(data) {
        this.id = data.id || null;
        this.date = data.date;
        this.timestamp = data.timestamp || new Date().toISOString();
        this.yoga = Number(data.yoga || 0);
        this.cardio = Number(data.cardio || 0);
        this.sleep = Number(data.sleep || 0);
        this.daily_gratitude = data.daily_gratitude || '';
        this.created_at = data.created_at || new Date().toISOString();
    }

    static fromFirestore(doc) {
        return new Entry({ id: doc.id, ...doc.data() });
    }

    toFirestore() {
        return {
            date: this.date,
            timestamp: this.timestamp,
            yoga: this.yoga,
            cardio: this.cardio,
            sleep: this.sleep,
            daily_gratitude: this.daily_gratitude,
            created_at: this.created_at
        };
    }

    get displayDate() {
        return new Date(this.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    get displayTime() {
        return new Date(this.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
} 