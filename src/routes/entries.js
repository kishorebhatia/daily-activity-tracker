import express from 'express';
import { getAllEntries, createEntry } from '../services/entryService.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const entries = await getAllEntries();
        res.json(entries);
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const entry = await createEntry(req.body);
        res.status(201).json(entry);
    } catch (error) {
        next(error);
    }
});

export default router;