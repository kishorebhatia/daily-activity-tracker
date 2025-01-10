import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGFEErr-CvH74vEmyxNfdR1gI2p-yVYp8",
  authDomain: "dailytracker-2989e.firebaseapp.com",
  projectId: "dailytracker-2989e",
  storageBucket: "dailytracker-2989e.firebasestorage.app",
  messagingSenderId: "544549161120",
  appId: "1:544549161120:web:b1db4a22d7e7f05d50e1c5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);