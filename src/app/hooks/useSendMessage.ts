"use client";
import { useCallback } from "react";
import {
  collection,
  addDoc,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useSendMessage(
  chatId: string | null,
  uid: string | null,
  receiverId: string | null,
  senderName: string | null
) {
  return useCallback(
    async (text: string) => {
      if (!text.trim() || !chatId || !uid || !receiverId) return;

      // 1. Save message
      await addDoc(collection(db, "messages", chatId, "chats"), {
        text,
        sender: uid,
        createdAt: serverTimestamp(),
      });

      // 2. Update conversation
      await setDoc(
        doc(db, "conversations", chatId),
        {
          participants: [uid, receiverId],
          lastMessage: text,
          lastMessageTimestamp: serverTimestamp(),
        },
        { merge: true }
      );

      // 3. Send browser push notification via API
      await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toUid: receiverId,
          fromName: senderName || "Someone",
          message: text,
        }),
      });
    },
    [chatId, uid, receiverId, senderName]
  );
}
