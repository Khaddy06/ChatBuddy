"use client";

import { useFCMToken } from "@/app/hooks/useFcm";
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getMessagingInstance } from "@/lib/firebase";

export default function FCMTokenLogger() {
  const token = useFCMToken();

  // 1. Register the service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((err) => {
          console.error("❌ SW registration failed:", err);
        });
    }
  }, []);

  // 2. Request notification permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        console.log("🔐 Notification permission:", permission);
      });
    }
  }, []);

  // 3. Log token
  useEffect(() => {
    if (token) {
      console.log("🔐 FCM Token from logger:", token);
      // Send token to backend if needed
    }
  }, [token]);

  // 4. Listen for foreground messages
  useEffect(() => {
    getMessagingInstance().then((messaging) => {
      if (!messaging) return;

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("📩 Foreground message:", payload);

        const { title, body, icon } = payload.notification || {};

        if (Notification.permission === "granted") {
          new Notification(title || "New Message", {
            body: body || "",
            icon: icon || "/default-icon.png",
          });
        }
      });

      return () => unsubscribe();
    });
  }, []);

  return null;
}
