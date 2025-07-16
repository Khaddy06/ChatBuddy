"use client";
import { useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collectionGroup,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { showNotification } from "@/lib/showNotification";

export default function GlobalMessageListener() {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (!user) return;

      const q = query(
        collectionGroup(db, "chats"),
        where("receiverId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const last = snapshot.docChanges().at(-1);
        if (!last || last.type !== "added") return;

        const data = last.doc.data();

        if (data.senderId !== user.uid) {
          showNotification(data.senderName || "New message", data.text || "");
        }
      });

      return () => unsubscribeMessages();
    });

    return () => unsubscribeAuth();
  }, []);

  return null;
}
