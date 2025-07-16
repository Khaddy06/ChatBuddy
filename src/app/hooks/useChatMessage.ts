// hooks/useChatMessages.ts
"use client";
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
}

export function useChatMessages(
  chatId: string | null,
  uid: string | null,
  receiverName?: string
) {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!chatId || !uid) return;

    const q = query(
      collection(db, "messages", chatId, "chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map((doc) => {
        const d = doc.data();
        return {
          id: doc.id,
          text: d.text,
          sender: d.sender,
          createdAt: d.createdAt,
        };
      });

      setMessages(all);


      // if (
      //   last &&
      //   last.type === "added" &&
      //   last.doc.data().sender !== uid &&
      //   Notification.permission === "granted" &&
      //   isPageVisible()
      // ) {
      //   showNotification(receiverName || "New message", last.doc.data().text);
      // }
    });

    return () => unsubscribe();
  }, [chatId, uid, receiverName]);

  return messages;
}
