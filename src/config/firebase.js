import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getConfig } from '../utils/configHandler.js';

const config = getConfig();
const app = initializeApp(config.firebase);
export const db = getFirestore(app);