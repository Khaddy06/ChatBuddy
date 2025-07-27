import { getToken } from "firebase/messaging";
import { messaging, auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.log("Notification permission not granted.");
    return;
  }

  console.log("✅ Notification permission granted!");

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY;
  console.log("🔑 VAPID KEY:", vapidKey);

  if (!messaging) {
    console.error("❌ Firebase messaging is not initialized.");
    return;
  }

  try {
    const token = await getToken(messaging, { vapidKey });
    console.log("✅ FCM Token:", token);

    // 🔄 Wait until auth.currentUser is ready
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await setDoc(doc(db, "fcmTokens", user.uid), { token });
        console.log("📦 Token saved to Firestore");
      } else {
        console.warn("❌ No user signed in, can't save token");
      }
    });
  } catch (err) {
    console.error("❌ Error getting token", err);
  }
};
