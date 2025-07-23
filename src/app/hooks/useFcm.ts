"use client";
import { useEffect, useState } from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { app } from "@/lib/firebase";

export function useFCMToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    async function fetchToken() {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        const supported = await isSupported();
        if (!supported) {
          console.warn("❌ FCM is not supported in this browser.");
          return;
        }
        

        const messaging = getMessaging(app);
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY;
        console.log("📢 VAPID KEY:", vapidKey);

        const currentToken = await getToken(messaging, {
          vapidKey,
        });

        if (currentToken) {
          setToken(currentToken);
          console.log("✅ FCM Token:", currentToken);
        } else {
          console.warn("❌ No registration token available.");
        }
      } catch (error) {
        console.error("FCM error:", error);
      }
    }

    fetchToken();
  }, []);

  return token;
}
