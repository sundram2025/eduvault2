// lib/firebase.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ============================================================
// REPLACE THESE WITH YOUR FIREBASE PROJECT CREDENTIALS
// Go to: Firebase Console → Project Settings → Your Apps → SDK setup
// ============================================================
const firebaseConfig = {
  apiKey: "AIzaSyC9twFZdJhdwx545wf3MfggKZQ2rc-ltd0",
  authDomain: "eduvault2-25cc1.firebaseapp.com",
  projectId: "eduvault2-25cc1",
  storageBucket: "eduvault2-25cc1.firebasestorage.app",
  messagingSenderId: "624468484161",
  appId: "1:624468484161:web:a81bcab3c52b06894966c0"
};

// Initialize Firebase (prevent duplicate initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
