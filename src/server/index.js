import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import configRouter from './routes/config.js';
import { getConfig } from '../utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const config = getConfig();

const app = express();

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

app.use(express.json());
app.use(express.static(join(__dirname, '..', '..', 'public')));
app.use('/api', configRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: config.server.env === 'development' ? err.message : undefined
    });
});

export default app; 