"use client";
import { useParams } from "next/navigation";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { getChatId } from "@/lib/chatutil";

interface Receiver {
  name: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uid, setUid] = useState<string | null>(null);
  const rawId = useParams().id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [receiver, setReceiver] = useState<Receiver | null>(null);

  useEffect(() => {
    if (!id) return;
    const userRef = doc(db, "users", id);
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        setReceiver(snap.data() as Receiver);
      }
    });
  }, [id]);
  // Setup uid from auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUid(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const chatId = uid && id ? getChatId(uid, id) : null;

  // Listen for new messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "messages", chatId, "chats"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          createdAt: data.createdAt,
        } as Message;
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId || !uid || !id) return;
    await addDoc(collection(db, "messages", chatId, "chats"), {
      text: newMessage,
      sender: uid,
      createdAt: serverTimestamp(),
    });
    const conversationRef = doc(db, "conversations", chatId);
    await setDoc(
      conversationRef,
      {
        participants: [uid, id],
        lastMessage: newMessage,
        lastMessageTimestamp: serverTimestamp(),
      },
      { merge: true }
    );
    setNewMessage("");
  };

  if (!uid || !id) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-full min-h-screen">
      <h1 className="text-2xl text-black font-semibold p-4 border-b bg-white">
        {receiver?.name || "your buddy"}
      </h1>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs p-2 rounded-lg ${
              msg.sender === uid
                ? "bg-blue-500 text-white ml-auto"
                : "bg-white border text-black"
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-right mt-1 opacity-70">
              {msg.createdAt?.toDate?.().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="p-4 border-t flex items-center gap-2 bg-white"
      >
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border px-4 py-2 text-black  placeholder:text-gray-500 rounded-lg focus:outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
}
