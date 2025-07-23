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
import { Trash2 } from "lucide-react";
import DeleteChatsModal from "./components/deleteModal";
import ChatForm from "./components/ChatForm";
import MessageList from "./components/MessageList";

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
    setSelectedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
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
      selectedChats.map((messageId) =>
        deleteDoc(doc(db, "messages", chatId, "chats", messageId))
      )
    );
    setSelectedChats([]);
    setShowDeleteModal(false);

    // Update conversation lastMessage and timestamp
    const chatRef = collection(db, "messages", chatId, "chats");
    const q = query(chatRef, orderBy("createdAt", "desc"), limit(1));
    const snapshot = await getDocs(q);
    const last = snapshot.docs[0];

    await updateDoc(doc(db, "conversations", chatId), {
      lastMessage: last ? last.data().text : "",
      lastMessageTimestamp: last ? last.data().createdAt : null,
    });
  };

  if (!uid || !id) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-full min-h-screen bg-[#F8F6FC] text-[#1E1E1E]">
      <h1 className="relative text-lg md:text-xl font-bold px-2 md:px-4 py-3 bg-white text-[#7F2982] border-b border-[#E0E0E0] shadow-sm flex items-center justify-center md:justify-between">
      <span className="mx-auto md:mx-0">
          {receiver?.name || "your buddy"}
        </span>
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

      {/* Message List */}
      <MessageList
        messages={messages}
        selectedChats={selectedChats}
        toggleChatSelection={toggleChatSelection}
        uid={uid}
        receiver={receiver}
        bottomRef={bottomRef}
      />

      {/* Delete Chats Modal */}
      <DeleteChatsModal
        open={showDeleteModal && selectedChats.length > 0}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteChat}
      />

      {/* Replace the form with ChatForm */}
      <ChatForm
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onSubmit={handleSubmit}
        inputRef={inputRef}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleSelectEmoji={handleSelectEmoji}
      />
    </div>
  );
}
