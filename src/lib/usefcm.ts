// lib/sendFCM.ts

import { getMessaging } from "firebase-admin/messaging";
import { db } from "./firebase-admin";

export async function sendMessageNotification({
  toUid,
  fromName,
  message,
}: {
  toUid: string;
  fromName: string;
  message: string;
}) {
  try {
    const userDoc = await db.collection("users").doc(toUid).get();
    const fcmToken = userDoc.data()?.fcmToken;

    if (!fcmToken) {
      console.warn("❌ No FCM token found for user:", toUid);
      return;
    }

    const payload = {
      token: fcmToken,
      notification: {
        title: fromName,
        body: message,
      },
      webpush: {
        notification: {
          icon: "/image/ani5.png", // optional icon
          badge: "/image/ani5.png", // optional badge
        },
      },
    };

    await getMessaging().send(payload);

    console.log("✅ Notification sent to", toUid);
  } catch (err) {
    console.error("❌ Error sending notification:", err);
  }
}
