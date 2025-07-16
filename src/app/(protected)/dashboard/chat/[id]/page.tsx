"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getChatId } from "@/lib/chatutil";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthUid } from "@/app/hooks/useAuthUid";
import { useChatMessages } from "@/app/hooks/useChatMessage";
import { useReceiver } from "@/app/hooks/useReceiver";
import { useSendMessage } from "@/app/hooks/useSendMessage";

export default function ChatPage() {
  const rawId = useParams().id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
 const uid = useAuthUid();
  const receiver = useReceiver(id || null);
  const chatId = useMemo(() => (uid && id ? getChatId(uid, id) : null), [uid, id]);
  const messages = useChatMessages(chatId, uid, receiver?.name);
  const sendMessage = useSendMessage(chatId, uid, id || null);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Update lastRead
  useEffect(() => {
    if (!chatId || !uid) return;
    setDoc(
      doc(db, "conversations", chatId),
      {
        lastRead: {
          [uid]: serverTimestamp(),
        },
      },
      { merge: true }
    );
  }, [chatId, uid]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
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
            key={`${msg.id}-${msg.createdAt?.seconds ?? Math.random()}`}
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

      <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2 bg-white">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border px-4 py-2 text-black placeholder:text-gray-500 rounded-lg focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </form>
    </div>
  );
}
