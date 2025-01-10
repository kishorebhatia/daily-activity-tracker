import express from 'express';
import { config } from './src/config/config.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { checkRequiredEnvVars } from './src/utils/checkEnv.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Check environment variables before starting the server
checkRequiredEnvVars();

const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${config.server.env}`);
});