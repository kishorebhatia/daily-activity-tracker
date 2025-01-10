import { 
    collection, 
    getDocs, 
    addDoc, 
    query, 
    orderBy 
} from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/database.js';

export async function getAllEntries() {
    try {
        const entriesRef = collection(db, COLLECTIONS.DAILY_ENTRIES);
        const q = query(entriesRef, orderBy('date', 'desc'));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        throw new Error('Failed to fetch entries from Firestore', { cause: error });
    }
}

export async function createEntry(entry) {
    try {
        const entriesRef = collection(db, COLLECTIONS.DAILY_ENTRIES);
        const docRef = await addDoc(entriesRef, {
            ...entry,
            created_at: new Date().toISOString()
        });
        
        return {
            id: docRef.id,
            ...entry
        };
    } catch (error) {
        throw new Error('Failed to create entry in Firestore', { cause: error });
    }
}