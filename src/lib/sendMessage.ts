// hooks/useSendMessage.ts
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { sendMessageNotification } from "./usefcm";

export function useSendMessage(
  chatId: string | null,
  uid: string | null,
  receiverId: string | null,
  senderName: string | null
) {
  return async (text: string) => {
    if (!chatId || !uid || !receiverId || !senderName) return;

    const messageData = {
      text,
      sender: uid,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "messages", chatId, "chats"), messageData);

    await sendMessageNotification({
      toUid: receiverId,
      fromName: senderName,
      message: text,
    });
  };
}

