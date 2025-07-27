// app/api/send-notification/route.ts
import { NextResponse } from "next/server";
import { getMessaging } from "firebase-admin/messaging";
import { db } from "@/lib/firebase-admin"; // server-side Firestore (if needed)
import { firebaseAdminApp } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  try {
    const { toUid, fromName, message } = await req.json();

    // 1. Get receiver's FCM token from Firestore
    const userSnap = await db.collection("users").doc(toUid).get();
    const userData = userSnap.data();
    const fcmToken = userData?.fcmToken;

    if (!fcmToken) {
      return NextResponse.json({ success: false, error: "No FCM token found" });
    }

    // 2. Send notification
    const messaging = getMessaging(firebaseAdminApp);
    await messaging.send({
      token: fcmToken,
      notification: {
        title: fromName,
        body: message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FCM error:", err);
    return NextResponse.json({ success: false, error: "Failed to send notification" });
  }
}
export const dynamic = "force-dynamic"; // Ensure this route is always fresh