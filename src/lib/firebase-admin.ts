import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { App } from "firebase-admin/app";

let firebaseAdminApp: App | null = null;
let db: ReturnType<typeof getFirestore> | null = null;

if (typeof window === "undefined" && process.env.FIREBASE_PROJECT_ID) {
  if (!getApps().length) {
    firebaseAdminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    firebaseAdminApp = getApps()[0];
  }

  db = getFirestore(firebaseAdminApp);
}

export { firebaseAdminApp, db };
