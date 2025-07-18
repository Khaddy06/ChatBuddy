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
  className="flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3 hover:shadow-md transition-shadow w-full"
>
  {/* Left: Avatar + Info */}
  <div className="flex items-center gap-3 min-w-0">
    <Avatar name={name} />
    <div className="min-w-0">
      <ChatInfo name={name} lastMessage={lastMessage} />
    </div>
  </div>

  {/* Right: Time */}
  <div className="text-sm text-gray-400 whitespace-nowrap pl-2 sm:pl-4 shrink-0">
    <TimeDisplay timeString={timeString} />
  </div>
</Link>

  </li>
  
  );
} 