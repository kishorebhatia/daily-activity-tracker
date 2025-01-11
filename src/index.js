import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import configRouter from './routes/config.js';
import { getConfig } from './utils/configHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const config = getConfig();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

// Mount routes
app.use('/api', configRouter);

// Add CORS headers for development
if (config.server.env === 'development') {
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        details: config.server.env === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port} in ${config.server.env} mode`);
    console.log(`Firebase config endpoint: http://localhost:${config.server.port}/api/firebase-config`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
});