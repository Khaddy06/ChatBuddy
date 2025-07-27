"use client";
import { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { showNotification } from "@/lib/showNotification";

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
  const lastMessageIdRef = useRef<string | null>(null); // 👈 Track last message ID

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

      const lastMessage = all[all.length - 1];

      if (
        lastMessage &&
        lastMessage.id !== lastMessageIdRef.current &&
        lastMessage.sender !== uid
      ) {
        showNotification({
          title: receiverName || "New message",
          body: lastMessage.text,
        });
        lastMessageIdRef.current = lastMessage.id; // 👈 Update reference
      }

      setMessages(all);
    });

    return () => unsubscribe();
  }, [chatId, uid, receiverName]);

  return messages;
}
