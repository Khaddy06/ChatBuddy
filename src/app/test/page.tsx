"use client";
import { useEffect, useState } from "react";
import { getMessagingInstance } from "@/lib/firebase";
import { getToken } from "firebase/messaging";

export default function NotificationsTestPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const messaging = await getMessagingInstance();
        if (!messaging) return console.warn("No messaging instance");

        const fcmToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (fcmToken) {
          console.log("✅ FCM Token:", fcmToken);
          setToken(fcmToken);
        } else {
          console.warn("⚠️ No registration token available.");
        }
      } catch (err) {
        console.error("🔥 Error fetching FCM token:", err);
      }
    };

    fetchToken();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Test FCM Notification</h1>
      <p className="mt-4 text-sm break-words">
        {token ?? "Fetching token..."}
      </p>
    </div>
  );
}
