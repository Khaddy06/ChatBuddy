"use client";

import { useEffect } from "react";
import { requestNotificationPermission } from "@/lib/notification";
import { messaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";

const NotificationInitializer = () => {
  useEffect(() => {
    // Register the service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }

    // Ask for notification permission
    requestNotificationPermission();

    // Handle foreground notifications
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("📨 Foreground notification received:", payload);

        // Optional: Show toast or custom UI
        if (Notification.permission === "granted" && payload.notification) {
          new Notification(payload.notification.title ?? "New Notification", {
            body: payload.notification.body,
            icon: "/image/ani5.png", // optional icon
          });
        }
      });
    }
  }, []);

  return null;
};

export default NotificationInitializer;
