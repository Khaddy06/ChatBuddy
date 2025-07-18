interface ChatInfoProps {
  name?: string;
  lastMessage: string;
}
export default function ChatInfo({ name, lastMessage }: ChatInfoProps) {
  return (
    <div className="flex flex-col min-w-0">
    <p className="font-semibold text-lg text-black truncate">
      {name ?? (
        <span className="inline-block h-4 w-24 bg-gray-200 animate-pulse rounded" />
      )}
    </p>
    <p className="text-gray-600 text-sm md:text-base truncate">
      {lastMessage}
    </p>
  </div>
  
  );
} 