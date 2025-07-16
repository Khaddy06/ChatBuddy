"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import ChatListItem from "./components/ChatListItem";
import { toast } from "sonner";

interface Conversation {
  chatId: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date;
  };
}

export default function ChatListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [uid: string]: string }>({});

  useEffect(() => {
    toast("🔔 Toast is working!");
  }, []);
  // Get current user UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Get all conversations
  useEffect(() => {
    if (!uid) return;

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", uid),
      orderBy("lastMessageTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Conversation, "chatId">;
        return { chatId: doc.id, ...data };
      });

      setConversations(convs);
    });

    return () => unsubscribe();
  }, [uid]);

  // Fetch other users' names
  useEffect(() => {
    const unknownUids = conversations
      .map((c) => c.participants.find((p) => p !== uid))
      .filter((id): id is string => !!id && !(id in userNames));

    if (unknownUids.length === 0) return;

    const fetchNames = async () => {
      const newNames: { [uid: string]: string } = {};
      for (const otherId of unknownUids) {
        const snap = await getDoc(doc(db, "users", otherId));
        if (snap.exists()) {
          const data = snap.data();
          newNames[otherId] = data.name || data.email || "Unknown";
        }
      }
      setUserNames((prev) => ({ ...prev, ...newNames }));
    };

    fetchNames();
  }, [conversations, uid, userNames]);

  if (!uid) return <p className="p-8 text-gray-500">Loading user...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-black">Chats</h1>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No chats yet. Start a conversation!</p>
      ) : (
        <ul className="space-y-4">
          {conversations.map(({ chatId, participants, lastMessage, lastMessageTimestamp }) => {
            const otherUserId = participants.find((p) => p !== uid);
            if (!otherUserId) return null;
            const name = userNames[otherUserId];
            const timeString = lastMessageTimestamp?.toDate?.()
              ? lastMessageTimestamp.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <ChatListItem
                key={chatId}
                chatId={chatId}
                otherUserId={otherUserId}
                name={name}
                lastMessage={lastMessage}
                timeString={timeString}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
