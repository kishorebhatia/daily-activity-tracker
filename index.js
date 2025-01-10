import express from 'express';
const app = express();
const port = 3111;

app.use(express.json());
app.use(express.static('public'));

// In-memory storage (in a real app, you'd use a database)
let dailyEntries = [];

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

app.post('/api/entries', (req, res) => {
    const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        ...req.body
    };
    dailyEntries.push(entry);
    res.json(entry);
});

app.get('/api/entries', (req, res) => {
    res.json(dailyEntries);
});

app.listen(port, () => {
    console.log(`App is live at http://localhost:${port}`);
});