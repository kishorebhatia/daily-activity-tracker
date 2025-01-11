import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class FirebaseService {
    static instance = null;
    
    constructor() {
        if (FirebaseService.instance) {
            return FirebaseService.instance;
        }
        FirebaseService.instance = this;
    }

    async initialize() {
        try {
            const response = await fetch('/api/firebase-config');
            if (!response.ok) throw new Error('Failed to fetch Firebase config');
            
            const config = await response.json();
            const app = initializeApp(config);
            this.db = getFirestore(app);
            
            return this.db;
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            throw error;
        }
    }

    getDb() {
        if (!this.db) throw new Error('Firebase not initialized');
        return this.db;
    }
}

export const firebaseService = new FirebaseService(); 