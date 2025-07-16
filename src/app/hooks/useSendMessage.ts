// hooks/useSendMessage.ts
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

export function useSendMessage(chatId: string | null, uid: string | null, receiverId: string | null) {
  return useCallback(
    async (text: string) => {
      if (!text.trim() || !chatId || !uid || !receiverId) return;

      await addDoc(collection(db, "messages", chatId, "chats"), {
        text,
        sender: uid,
        createdAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "conversations", chatId),
        {
          participants: [uid, receiverId],
          lastMessage: text,
          lastMessageTimestamp: serverTimestamp(),
        },
        { merge: true }
      );
    },
    [chatId, uid, receiverId]
  );
}
