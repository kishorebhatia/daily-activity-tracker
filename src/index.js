import express from 'express';
import entriesRouter from './routes/entries.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const port = 3111;

async function startServer() {
    try {
        app.use(express.json());
        app.use(express.static('public'));
        
        // Routes
        app.use('/api/entries', entriesRouter);
        
        // Error handling
        app.use(errorHandler);
        
        app.listen(port, () => {
            console.log(`App is live at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();