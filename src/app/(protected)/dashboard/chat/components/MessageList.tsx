import React, { RefObject } from "react";
import { Timestamp } from "firebase/firestore";

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
}

interface MessageListProps {
  messages: Message[];
  selectedChats: string[];
  toggleChatSelection: (id: string) => void;
  uid: string | null;
  receiver: { name?: string } | null;
  bottomRef: RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  selectedChats,
  toggleChatSelection,
  uid,
  receiver,
  bottomRef,
}) => (
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
);

export default MessageList; 