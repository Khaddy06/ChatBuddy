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
        className="flex items-center justify-between gap-3 p-4 bg-white rounded shadow hover:bg-blue-50 transition"
      >
        <div className="flex items-center gap-3">
          <Avatar name={name} />
          <ChatInfo name={name} lastMessage={lastMessage} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <TimeDisplay timeString={timeString} />
        </div>
      </Link>
    </li>
  );
} 