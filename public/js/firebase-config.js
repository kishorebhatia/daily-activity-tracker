import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let db = null;

async function initializeFirebase() {
    try {
        // Fetch config from server
        const response = await fetch('/api/firebase-config').catch(error => {
            throw new Error('Network error: Unable to fetch Firebase configuration');
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const config = await response.json();
        
        // Validate config
        if (!config.apiKey || !config.projectId) {
            throw new Error('Invalid Firebase configuration received');
        }

        // Initialize Firebase
        const app = initializeApp(config);
        db = getFirestore(app);

        // Enable offline persistence
        try {
            await enableIndexedDbPersistence(db);
            console.log('Offline persistence enabled');
        } catch (err) {
            if (err.code === 'failed-precondition') {
                console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
            } else if (err.code === 'unimplemented') {
                console.warn('Browser doesn\'t support persistence');
            }
        }

        return db;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        showInitializationError(error);
        throw error;
    }
}

function showInitializationError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'firebase-error';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>Connection Error</h3>
            <p>${error.message}</p>
            <button onclick="location.reload()">Retry</button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// Initialize Firebase and export the db
try {
    db = await initializeFirebase();
} catch (error) {
    console.error('Failed to initialize Firebase:', error);
}

export { db }; 