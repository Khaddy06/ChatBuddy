interface TimeDisplayProps {
  timeString: string;
}
export default function TimeDisplay({ timeString }: TimeDisplayProps) {
  if (!timeString) return null;
  return <span className="text-xs text-gray-400">{timeString}</span>;
} 