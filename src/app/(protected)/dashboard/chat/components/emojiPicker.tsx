// components/EmojiPicker.tsx
"use client";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

export default function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <div className="absolute bottom-12 left-2 z-50">
      <Picker data={data} onEmojiSelect={onEmojiSelect} theme="#343452" />
    </div>
  );
}
