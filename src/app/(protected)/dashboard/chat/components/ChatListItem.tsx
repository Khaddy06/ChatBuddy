import Link from "next/link";
import Avatar from "./Avatar";
import ChatInfo from "./ChatInfo";
import TimeDisplay from "./TimeDisplay";

interface ChatListItemProps {
  chatId: string;
  otherUserId: string;
  name: string;
  lastMessage: string;
  timeString: string;
}

export default function ChatListItem({
  chatId,
  otherUserId,
  name,
  lastMessage,
  timeString,
}: ChatListItemProps) {
  return (
    <li key={chatId}>
    <Link
      href={`/dashboard/chat/${otherUserId}`}
      className="flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow"
    >
      {/* Left: Avatar + Info */}
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <ChatInfo name={name} lastMessage={lastMessage} />
      </div>
  
      {/* Right: Time */}
      <div className="text-sm text-gray-400 whitespace-nowrap pl-4">
        <TimeDisplay timeString={timeString} />
      </div>
    </Link>
  </li>
  
  );
} 