// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, browserLocalPersistence,setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBtO4xVtu8t8bUj3WAZ6nY67v96F90v-Y0",
  authDomain: "chat-app-ebdf7.firebaseapp.com",
  projectId: "chat-app-ebdf7",
  storageBucket: "chat-app-ebdf7.firebasestorage.app",
  messagingSenderId: "334171912164",
  appId: "1:334171912164:web:7d22f6f02f8b39e6e279f1",
  measurementId: "G-5HTB70NSS3",
};


// Prevent re-initialization during hot reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app); // ✅ This line makes auth available
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app); // optional

setPersistence(auth, browserLocalPersistence)
 .then(() => {
    console.log("Firebase auth persistence set to localStorage.");
 })
 .catch((error) => {
    console.error("Error setting Firebase persistence:", error);
 });

 let messagingInstance: ReturnType<typeof getMessaging> | null = null;

export const getMessagingInstance = async () => {
  if (!messagingInstance) {
    const supported = await isSupported();
    if (supported) {
      messagingInstance = getMessaging(app);
    } else {
      console.warn("FCM is not supported in this browser.");
    }
  }
  return messagingInstance;
};
export {app}