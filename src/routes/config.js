import express from 'express';
import { getFirebaseConfig } from '../utils/configHandler.js';

const router = express.Router();

router.get('/firebase-config', (req, res) => {
    try {
        const config = getFirebaseConfig();
        
        // Validate config before sending
        if (!config.apiKey || !config.projectId) {
            throw new Error('Invalid Firebase configuration');
        }
        
        res.json(config);
    } catch (error) {
        console.error('Config error:', error);
        res.status(500).json({ 
            error: 'Failed to load configuration',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router; 