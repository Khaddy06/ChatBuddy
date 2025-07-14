import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { getChatId } from "./chatutil";
import { User } from "@/types/user";

export async function getContacts(currentUserId: string) {
  const snapshot = await getDocs(collection(db, "users"));
  const contacts = await Promise.all(
    snapshot.docs
      .map((doc) => doc.data() as User)
      .filter((user) => user.uid !== currentUserId)
      .map(async (user) => {
        const chatId = getChatId(currentUserId, user.uid);
        const messagesRef = collection(db, "messages", chatId, "chats");
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const latestSnap = await getDocs(q);
        const lastMessageDoc = latestSnap.docs[0];
        const lastMessage = lastMessageDoc?.data()?.text || null;
        const timestamp = lastMessageDoc?.data()?.createdAt?.toDate() || null;

        return {
          uid: user.uid,
          name: user.name,
          email: user.email,
          lastMessage,
          timestamp,
        };
      })
  );

  return contacts;
}
