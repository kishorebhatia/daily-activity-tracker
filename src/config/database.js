import { db } from './firebase.js';
import { collection } from 'firebase/firestore';

export const COLLECTIONS = {
    DAILY_ENTRIES: 'daily_entries'
};

export function getCollection(collectionName) {
    return collection(db, collectionName);
}