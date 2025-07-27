// lib/firebase

"use client"
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
getAuth,
browserLocalPersistence,
setPersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, Messaging, onMessage } from 'firebase/messaging';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
apiKey: 'AIzaSyBtO4xVtu8t8bUj3WAZ6nY67v96F90v-Y0',
authDomain: 'chat-app-ebdf7.firebaseapp.com',
projectId: 'chat-app-ebdf7',
storageBucket: 'chat-app-ebdf7.appspot.com', // ❗️Fixed typo: .app → .appspot.com
messagingSenderId: '334171912164',
appId: '1:334171912164:web:7d22f6f02f8b39e6e279f1',
measurementId: 'G-5HTB70NSS3',
};

const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

setPersistence(auth, browserLocalPersistence)
.then(() => console.log('Firebase auth persistence set to localStorage.'))
.catch((error) => console.error('Error setting Firebase persistence:', error));

let messaging: Messaging | null = null;

if (typeof window !== 'undefined' && 'Notification' in window && firebaseApp) {
  try {
    messaging = getMessaging(firebaseApp);
  } catch (err) {
    console.warn("Failed to initialize Firebase Messaging:", err);
  }
}


export { firebaseApp, messaging, auth, db, storage, getToken, onMessage };
