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
import Link from "next/link";

interface Conversation {
  chatId: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: {
    seconds: number;
    nanoseconds: number;
    toDate: () => Date; // Firestore Timestamp method
  };
}

export default function ChatListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [uid, setUid] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [uid: string]: string }>({});
  

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Get conversations
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



  // Fetch names of other users
  useEffect(() => {
    const unknownUids = conversations
      .map((c) => c.participants.find((p) => p !== uid))
      .filter((id): id is string => !!id && !(id in userNames));

    if (unknownUids.length === 0) return;

    const fetchMissingUsers = async () => {
      const newNames: { [uid: string]: string } = {};

      for (const uid of unknownUids) {
        const snap = await getDoc(doc(db, "users", uid));
        if (snap.exists()) {
          const data = snap.data();
          newNames[uid] = data.name || data.email || "Unknown";
        }
      }

      setUserNames((prev) => ({ ...prev, ...newNames }));
    };

    fetchMissingUsers();
  }, [conversations, uid, userNames]);

  if (!uid) return <p className="p-8 text-gray-500">Loading user...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Chats</h1>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No chats yet. Start a conversation!</p>
      ) : (
        <ul className="space-y-4">
  


          {conversations.map(
            ({ chatId, participants, lastMessage, lastMessageTimestamp }) => {
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
                <li key={chatId}>
                  <Link
                    href={`/dashboard/chat/${otherUserId}`}
                    className="flex items-center justify-between gap-3 p-4 bg-white rounded shadow hover:bg-blue-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm uppercase">
                        {name ? name.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {name ?? (
                            <span className="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded" />
                          )}
                        </p>
                        <p className="text-gray-600 truncate max-w-xs">
                          {lastMessage}
                        </p>
                      </div>
                    </div>
                    {timeString && (
                      <span className="text-xs text-gray-400">
                        {timeString}
                      </span>
                    )}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
      )}
    </div>
  );
}
