"use client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { getChatId } from "@/lib/chatutil";
import {
  setDoc,
  doc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  collection,
  getDocs,
  limit,
  query,
  updateDoc,
 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthUid } from "@/app/hooks/useAuthUid";
import { useChatMessages } from "@/app/hooks/useChatMessage";
import { useReceiver } from "@/app/hooks/useReceiver";
import { useSendMessage } from "@/app/hooks/useSendMessage";
import { Smile, Menu, Trash2 } from "lucide-react";
import EmojiPicker from "../components/emojiPicker";
import DeleteChatsModal from "../components/deleteModal";

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
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

const toggleChatSelection = (chatId: string) => {
  setSelectedChats(prev =>
    prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
  );
};


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

  const handleDeleteChat = async () => {
    if (!chatId) return;
    await Promise.all(
      selectedChats.map(messageId =>
        deleteDoc(doc(db, "messages", chatId, "chats", messageId))
      )
    );
    setSelectedChats([]);
    setShowDeleteModal(false);

    // Update conversation lastMessage and timestamp
    const  chatRef = collection(db,"messages", chatId, "chats");
    const q = query(chatRef,orderBy("createdAt", "desc"),limit(1));
    const snapshot =await getDocs(q);
    const last = snapshot.docs[0] 

    await updateDoc(doc(db, "conversations", chatId),{
      lastMessage:last? last.data().text: "",
      lastMessageTimestamp: last? last.data().createdAt: null
    });
  };

  if (!uid || !id) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F6FC] text-[#1E1E1E]">
      <h1 className="relative text-lg md:text-xl font-bold px-2 md:px-4 py-3 bg-white text-[#7F2982] border-b border-[#E0E0E0] shadow-sm flex items-center justify-center md:justify-between">
        {/* Mobile menu button */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              const evt = new CustomEvent('open-dashboard-menu');
              window.dispatchEvent(evt);
            }
          }}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 md:hidden text-[#7F2982] bg-white/80 rounded-full p-2 shadow-md hover:bg-[#F7717D]/10 transition"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <span className="mx-auto md:mx-0">{receiver?.name || "your buddy"}</span>
        {selectedChats.length > 0 && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="ml-2 md:ml-4 p-2 rounded-full bg-[#F7717D]/10 hover:bg-[#F7717D]/20 text-[#F7717D] hover:text-[#DE639A] transition"
            title="Delete Selected Messages"
            aria-label="Delete Selected Messages"
          >
            <Trash2 size={20} />
          </button>
        )}
      </h1>

      <div className="flex-1 overflow-y-auto p-2 md:p-4 bg-[#F8F6FC] space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-16 text-center text-[#7F2982]/80">
            <svg width="48" height="48" fill="none" viewBox="0 0 64 64" className="mx-auto mb-4">
              <circle cx="32" cy="32" r="32" fill="#F7717D" fillOpacity="0.1"/>
              <path d="M20 40h24M24 28h16M28 36h8" stroke="#DE639A" strokeWidth="2" strokeLinecap="round"/>
              <ellipse cx="32" cy="32" rx="16" ry="12" fill="#F7717D" fillOpacity="0.15"/>
            </svg>
            <div className="text-lg md:text-xl font-semibold mb-2">No messages yet</div>
            <div className="text-sm md:text-base">Start the conversation with <span className="font-bold">{receiver?.name || "your buddy"}</span>!</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => toggleChatSelection(msg.id)}
              className={`p-3 rounded-md cursor-pointer ${
                selectedChats.includes(msg.id) ? "bg-[#7F2982]/10" : "hover:bg-gray-100"
              }`}
            >
              <div
                key={`${msg.id}-${msg.createdAt?.seconds ?? Math.random()}`}
                className={`break-words max-w-[80%] sm:max-w-xs md:max-w-md p-2 md:p-3 rounded-2xl shadow-md text-sm md:text-base ${
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
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Delete Chats Modal */}
      <DeleteChatsModal
        open={showDeleteModal && selectedChats.length > 0}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteChat}
      />

      <form
        onSubmit={handleSubmit}
        className="p-2 md:p-4 border-t flex items-center gap-2 bg-white sticky bottom-0 w-full flex-wrap md:flex-nowrap"
      >
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-[#7F2982] hover:text-[#F7717D] transition flex-shrink-0"
        >
          <Smile size={24} />
        </button>
        {showEmojiPicker && (
          <div className="absolute left-2 bottom-16 md:bottom-16 z-50 max-w-[90vw]">
            <EmojiPicker onEmojiSelect={handleSelectEmoji} />
          </div>
        )}
        <input
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-w-0 bg-[#F8F6FC] text-[#1E1E1E] placeholder:text-[#7F2982] border border-[#E0E0E0] px-2 md:px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE639A] text-sm md:text-base"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-[#F7717D] via-[#DE639A] to-[#7F2982] text-white font-bold px-3 md:px-4 py-2 rounded-xl shadow-md hover:from-[#DE639A] hover:to-[#F7717D] transition text-sm md:text-base flex-shrink-0"
        >
          Send
        </button>
      </form>

  
    </div>
  );
}
