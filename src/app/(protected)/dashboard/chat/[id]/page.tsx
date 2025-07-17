"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getChatId } from "@/lib/chatutil";
import {
  setDoc,
  doc,
  serverTimestamp,
 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthUid } from "@/app/hooks/useAuthUid";
import { useChatMessages } from "@/app/hooks/useChatMessage";
import { useReceiver } from "@/app/hooks/useReceiver";
import { useSendMessage } from "@/app/hooks/useSendMessage";
import { Smile } from "lucide-react";
import EmojiPicker from "../components/emojiPicker";

export default function ChatPage() {
  const rawId = useParams().id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const uid = useAuthUid();
  const receiver = useReceiver(id || null);

  const chatId = useMemo(
    () => (uid && id ? getChatId(uid, id) : null),
    [uid, id]
  );
  const messages = useChatMessages(chatId, uid, receiver?.name);
  const sendMessage = useSendMessage(chatId, uid, id || null);

  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Handle emoji select
  const handleSelectEmoji = (emoji: { native: string }) => {
    const input = inputRef.current;
    if (!input || !emoji?.native) return;

    const native = emoji.native;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    const newText = newMessage.slice(0, start) + native + newMessage.slice(end);
    setNewMessage(newText);

    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(start + native.length, start + native.length);
    });
  };

  // Update lastRead timestamp
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

  // Auto-scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage);
    setNewMessage("");
  };

  // Delete chat handler
  // async function handleDeleteSingleMessage(chatId: string, messageId: string) {
  //   if (!chatId || !messageId) return;

  //   try {
  //     await deleteDoc(doc(db, "messages", chatId, "chats", messageId));
  //     console.log("Message deleted successfully");
  //   } catch (error) {
  //     console.error("Error deleting message:", error);
  //   }
  // }

  if (!uid || !id) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F6FC] text-[#1E1E1E]">
      <h1 className="text-lg md:text-xl font-bold px-4 py-3 bg-white text-[#7F2982] border-b border-[#E0E0E0] shadow-sm flex items-center justify-between">
        <span>{receiver?.name || "Your buddy"}</span>
        {/* <button
          onClick={() => setShowDeleteModal(true)}
          className="ml-4 px-3 py-1 rounded-lg bg-[#F7717D] text-white text-sm font-semibold hover:bg-[#DE639A] transition"
        >
          Delete Chat
        </button> */}
      </h1>

      {/* {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-[#F7717D] mb-4">
              Delete Chat?
            </h2>
            <p className="mb-6 text-[#7F2982]">
              Are you sure you want to delete this chat? This cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-[#7F2982] font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowDeleteModal(false); // optional if using a confirmation modal
                  if (chatId && id) {
                    await handleDeleteSingleMessage(chatId, id);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#F7717D] text-white font-semibold hover:bg-[#DE639A] transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )} */}

      <div className="flex-1 overflow-y-auto p-4 bg-[#F8F6FC] space-y-3">
        {messages.map((msg) => (
          <div
            key={`${msg.id}-${msg.createdAt?.seconds ?? Math.random()}`}
            className={`max-w-xs p-3 rounded-2xl shadow-md ${
              msg.sender === uid
                ? "bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] text-white ml-auto"
                : "bg-white border border-[#E0E0E0] text-[#1E1E1E] mr-auto"
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-right mt-1 opacity-60">
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
        onSubmit={handleSubmit}
        className="p-4 border-t flex items-center gap-2 bg-white sticky bottom-0"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-[#7F2982] hover:text-[#F7717D] transition"
        >
          <Smile size={24} />
        </button>
        {showEmojiPicker && <EmojiPicker onEmojiSelect={handleSelectEmoji} />}
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-[#F8F6FC] text-[#1E1E1E] placeholder:text-[#7F2982] border border-[#E0E0E0] px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE639A]"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] text-white font-bold px-4 py-2 rounded-xl shadow-md hover:from-[#DE639A] hover:to-[#F7717D] transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
