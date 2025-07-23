import { Smile } from "lucide-react";
import EmojiPicker from "./emojiPicker";
import React, { RefObject } from "react";

interface ChatFormProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
  handleSelectEmoji: (emoji: { native: string }) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({
  value,
  onChange,
  onSubmit,
  inputRef,
  showEmojiPicker,
  setShowEmojiPicker,
  handleSelectEmoji,
}) => (
  <form
    onSubmit={onSubmit}
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
      value={value}
      onChange={onChange}
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
);

export default ChatForm; 