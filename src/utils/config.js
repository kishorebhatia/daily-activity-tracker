import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..', '..');

export function initializeConfig() {
    const result = dotenv.config({ path: join(rootDir, '.env') });
    
    if (result.error) {
        throw new Error('Failed to load environment variables');
    }

    validateConfig();
}

function validateConfig() {
    const required = [
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_PROJECT_ID',
        'FIREBASE_APP_ID'
    ];

    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

export function getConfig() {
    return {
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            appId: process.env.FIREBASE_APP_ID
        },
        server: {
            port: parseInt(process.env.PORT || '3111', 10),
            env: process.env.NODE_ENV || 'development'
        }
    };
} 