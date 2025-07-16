interface ChatInfoProps {
  name?: string;
  lastMessage: string;
}
export default function ChatInfo({ name, lastMessage }: ChatInfoProps) {
  return (
    <div>
      <p className="font-semibold text-lg text-black">
        {name ?? (
          <span className="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded" />
        )}
      </p>
      <p className="text-gray-600 truncate max-w-xs">{lastMessage}</p>
    </div>
  );
} 